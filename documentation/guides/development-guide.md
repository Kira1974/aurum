# 📘 Development Guide

La **Guía de Desarrollo de Paprika** provee una visión estructurada de cómo aplicar los principios de **Domain-Driven
Design (DDD)** en proyectos con **NestJS**.  
Su objetivo es ayudar a los desarrolladores a entender el propósito de cada capa arquitectónica y cómo se integran,
asegurando que los módulos sean **autónomos, consistentes y mantenibles**.

---

## 📑 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Guía de Módulos](#guia-de-modulos)
    - [Domain Guide](#domain-guide)
    - [Application Guide](#application-guide)
    - [Infrastructure Guide](#infrastructure-guide)
    - [Interface Guide](#interface-guide)
    - [Shared Guide](#shared-guide)
    - [Config](#configuracion)
3. [Convenciones de Nomenclatura](#convenciones-de-nomenclatura)
3. [Testing](#testing)
4. [Health Check](#health-check)
5. [Pre-commit](#pre-commit)
6. [Next Steps](#next-steps)

---

## 🧩 Arquitectura General <a name="arquitectura-general"></a>

Paprika sigue la **arquitectura en capas de DDD**, separando las reglas de negocio de los detalles técnicos:

- 🧠 **Domain Layer** → Lógica de negocio pura y entidades.
- 🎯 **Application Layer** → Orquesta casos de uso y define contratos.
- 🏗 **Infrastructure Layer** → Implementaciones técnicas (DB, providers, eventos).
- 🌐 **Interface Layer** → Expone funcionalidad vía HTTP, gRPC o mensajería.

#### Capas de la Arquitectura

```
    ┌──────────────┐
    │   Interface  │  ← cómo se expone al exterior (HTTP, gRPC, Kafka…)
    └──────┬───────┘
           │
    ┌──────┴───────┐
    │ Application  │  ← orquesta casos de uso (qué hacer y en qué orden)
    └──────┬───────┘
           │
    ┌──────┴───────┐
    │    Domain    │  ← corazón del negocio (qué reglas existen)
    └──────┬───────┘
           │
    ┌──────┴───────┐
    │Infrastructure│  ← implementaciones técnicas (DB, APIs, Kafka…)
    └──────────────┘
```

---

## 📚 Guía de Módulos <a name="guia-de-modulos"></a>

### 🧠 Domain Guide <a name="domain-guide"></a>

Contiene la **lógica central del negocio**, sin dependencias técnicas:

- `entities/` → Entidades (`*.entity.ts`) encapsulan estado y comportamiento.
- `services/` → Servicios (`*.service.ts`) implementan reglas de negocio.
- `value-objects/` → Objetos de Valor (`*.vo.ts`) representan conceptos del dominio que:
    - Son **inmutables** (una vez creados no cambian).
    - Encapsulan **validación y comportamiento específico** del valor.
    - Se comparan por su **valor**, no por identidad (dos objetos con el mismo valor son iguales).
- `models/` → Models (`*.model.ts`) define interfaces (Props) que establecen la estructura mínima de datos requerida
  por una Entidad de dominio.

---

### 🎯 Application Guide <a name="application-guide"></a>

Define **qué hay que hacer**, sin importar cómo se hace:

- `dto/` → DTOs (`*.dto.ts`) para entrada y salida de datos.
- `use-cases/` → Casos de uso (`*.use-case.ts`) representan operaciones del negocio.
- `mappers/` → Contiene mapeadores (`*.mapper.ts`)  responsables de transformar datos entre capas (por ejemplo: de
  entidades de dominio
  a DTOs, de eventos de dominio a eventos de integración, o de modelos de persistencia a entidades de dominio).
- `contracts/` → Contratos/Puertos (`*.contract.ts`) especifican dependencias técnicas.

##### 📂 Organización Contracts

Se organizan por tipo de dependencia para mantener claridad:

- `repositories/` → contratos para persistencia de datos (ej. `IHelloRepository`).
- `providers/` → contratos de dependencias externas que proveen datos/servicios al dominio (ej. APIs externas).
- `services/` → contratos de servicios transversales usados por los casos de uso (ej. envío de correos, hashing,
  notificaciones).
- `events/` → contratos para la mensajería (ej. `IHelloProducer`, `IEventConsumer`), desacoplando la aplicación
  del broker real (Kafka, RabbitMQ, etc.).
- `grpc/` → contratos de servicios gRPC generados a partir de `.proto`.

```txt
application/
  ├── contracts/
  │   ├── repositories/
  │   │   └── hello-repository.contract.ts
  │   ├── providers/
  │   │   └── hello-provider.contract.ts
  │   ├── services/
  │   │   └── hello-service.contract.ts
  │   ├── events/
  │   │   ├── event-producer.contract.ts
  │   │   └── event-consumer.contract.ts
  │   └── grpc/
  │       └── app-grpc-service.contract.ts
```

---

### 🏗 Infrastructure Guide <a name="infrastructure-guide"></a>

Implementaciones concretas de los contratos definidos en `application/`.

- `persistence/` → Persistencia con repositorios (`*.repository.ts`).
- `providers/` → Providers para servicios externos (AWS, SMS, Kafka).
- `events/` → Productores/consumidores de eventos.
- `config/` → Configuración de integraciones (`*.config.ts`).

---

### 🌐 Interface Guide <a name="interface-guide"></a>

Maneja la **exposición al exterior**:

- `interceptors/` → Interceptores para logging, errores o métricas.
- `*.controller.ts` → Los controladores exponen las funcionalidades del módulo al exterior. Su organización depende de
  los protocolos utilizados:
    - **Caso único**  
      Si el módulo expone su API únicamente por un protocolo (ejemplo: solo HTTP o solo gRPC), los controladores (
      `*.controller.ts`) se ubican directamente en la raíz de `interface/`.
      ```
       interface/
          ├── deposit.controller.ts
          └── interceptors/
              └── logging.interceptor.ts
      ```

    - **Caso híbrido**  
      Si el módulo requiere exponer más de un protocolo (ejemplo: HTTP + gRPC, HTTP + GraphQL), los
      controladores se organizan en subcarpetas con el nombre del protocolo.
      ```
         interface/
            ├── http/
            │   └── deposit.controller.ts
            ├── grpc/
            │   └── deposit.controller.ts
            ├── graphql/
            │   └── hello.resolver.ts
            └── interceptors/
                └── deposit.interceptor.spec.ts
      ```

    - **Nota sobre GraphQL:** Aunque actualmente no se implemente, la arquitectura está preparada para soportar GraphQL
      como
      protocolo adicional en el futuro.
        - En ese caso, las clases se llaman **resolvers** (`*.resolver.ts`) y no controladores, porque en GraphQL cada
          **resolver** se encarga de **resolver un campo del esquema definido en el `schema.graphql`** (ej. `Query`,
          `Mutation`, `Subscription`).
        - A diferencia de un `controller` que gestiona un endpoint completo, un `resolver` responde a consultas más
          granulares dentro de una misma petición.

---

### 🛠 Shared Guide <a name="shared-guide"></a>

El módulo `shared/` contiene **recursos comunes y reutilizables** entre los distintos módulos de la aplicación.  
Su objetivo es centralizar utilidades, constantes o integraciones que no pertenecen a un dominio específico pero que son
necesarias en varios.

#### Estructura actual

- `constant/` → Constantes globales, principalmente para **inyección de dependencias** y valores usados en múltiples
  capas.
- `utils/` → Funciones y clases utilitarias de uso transversal.

#### Escalabilidad del módulo shared

En proyectos pequeños `shared/` puede ser mínimo, pero si el proyecto crece, este módulo puede expandirse siguiendo los
principios de DDD para organizar mejor los recursos. Ejemplos de crecimiento:

- **Integraciones comunes**  
  Si varios módulos de la aplicación consumen o producen eventos de **Kafka**, esta integración puede centralizarse
  dentro
  de `shared/` siguiendo la misma lógica de DDD.

```txt
    shared/
    ├── constant/
    │   └── tokens.ts
    ├── utils/
    │   └── util.ts
    ├── kafka/
    │   ├── application/
    │   │   ├── contracts/
    │   │   │   ├── event-consumer.interface.ts
    │   │   │   └── event-producer.interface.ts
    │   │   └── services/
    │   │       └── kafka.service.ts
    │   ├── infrastructure/
    │   │   ├── kafka.consumer.ts
    │   │   ├── kafka.producer.ts
    │   │   └── kafka.module.ts
    │   └── interface/
    │       └── (si se definen controladores o resolvers para exponer métricas, healthchecks, etc.)
    └── interceptors/
        └── logging.interceptor.ts
```

**El criterio principal es:**
👉 Si un recurso es transversal y no pertenece a un único contexto de dominio, debe moverse a `shared/` y organizarse
siguiendo la misma lógica de capas de DDD (application, infrastructure, domain, interface) si así lo requiere la
complejidad.
---

### ⚙️ Configuration Guide <a name="configuracion"></a>

**Variables de Entorno**:
Este proyecto utiliza [dotenv](https://www.npmjs.com/package/dotenv) para cargar variables desde un archivo `.env`
y [Joi](https://joi.dev/) para validar que dichas variables sean correctas antes de inicializar la aplicación.

1. Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example`).
2. Define las variables necesarias.
3. Antes de arrancar la aplicación, estas variables se validan contra un esquema usando **Joi**.

### 📑 Ejemplo de implementación

```ts
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required()
  })
  .unknown(true);

const validationResult = envsSchema.validate(process.env);

if (validationResult.error) {
  throw new Error(`Config validation error: ${validationResult.error.message}`);
}

const envVars: EnvVars = validationResult.value;

export const envs = {
  port: envVars.PORT
};
```

#### 🗂 Organización de variables de entorno

- **Caso simple**
  Si las variables de entorno no crecen mucho (ejemplo: solo PORT, DATABASE_URL), se pueden manejar en un solo
  archivo centralizado (`envs.config.ts`).
- **Caso complejo**
  Si el proyecto escala y se introducen múltiples recursos (ejemplo: Kafka, Redis, PostgreSQL, Auth0, etc.), lo ideal es
  desacoplar las interfaces de configuración.
  Esto permite mantener el código más organizado y con tipados específicos para cada recurso.
  ```txt
    src/
      ├── config/
      │   ├── envs.model.ts ← interfaces
      │   └── envs.config.ts   ← punto de entrada común
  ```

---

### Convenciones de Nomenclatura <a name="convenciones-de-nomenclatura"></a>

#### 📂 Archivos

Se utiliza **kebab-case** (`minusculas-con-guiones`) para todos los nombres de archivos.

- Entidades → `*.entity.ts` → `deposit.entity.ts`
- Servicios de dominio → `*.service.ts` → `deposit.service.ts`
- Casos de uso → `*.use-case.ts` → `create-deposit.use-case.ts`
- Contratos → `*.contract.ts`
- Repositorios → `*.repository.ts` → `hello.repository.ts`
- DTOs → `*.dto.ts` → `create-deposit-request.dto.ts`
- Controladores → `*.controller.ts` → `deposit.controller.ts`
- Interceptores → `*.interceptor.ts` → `deposit.interceptor.spec.ts`
- Value Objects → `*.vo.ts`

#### 📝 Contenido interno

Se utiliza **PascalCase** (`TodasLasPalabrasInicianConMayúscula`) para definir los nombres de Clases, DTOs, Interfaces,
etc.

- **Entidades:** Nombre singular.

    ```
    
    export class Hello {...} // Un saludo
    
    ```

- **Modelos:** Nombre + Props.

    ```
    
    export class HelloProps {...}
    
    ```

- **Value Objects:** Nombre descriptivo.

    ```
    
    export class Message {...} // El contenido del mensaje
    export class PhoneNumber {...} // Un número de teléfono
    export class ProviderName {...} // El nombre del proveedor
    
    ```

- **Servicios de Dominio:** Nombre + Service.

    ```
    
    export class DepositService {...} // Lógica del saludo
    export class SmsService {...} // Lógica de SMS
    export class OrchestrationService {...} // Lógica de orquestación
    
    ```

- **Contratos (interfaces):** I + Nombre + Tipo Archivo

    ```
    
    export interface IHelloRepository {...}
    export interface IHelloService {...}
    export interface IHelloProvider {...}
    
    ```

- **DTOs (Data Transfer Objects):** Acción + Entidad + Dto

    ```
    
    export class CreateHelloDto {...}
    export class SendSmsDto {...}
    export class SmsResponseDto {...}
    
    ```

- **Casos de uso:** Acción + Entidad + UseCase

    ```
    
    export class CreateDepositUseCase {...}
    export class SendSmsUseCase {...}
    export class GetSmsStatusUseCase {...}
    
    ```

- **Configuracion:** Nombre + Config

    ```
    
    export class AwsConfigService {...}
    export class AldeamoConfigService {...}
    
    ```

- **Persistencia de datos:** Nombre + Repository

    ```
    
    export class HelloRepository {...}
    
    ```

- **Providers:** Nombre + Provider

    ```
    
    export class AwsSnsProvider {...}
    
    ```

- **Eventos:** Nombre + Acción + Evento

    ```
    
    export class KafkaConsumerAdapter {...}
    export class KafkaProducerAdapter {...}
    
    ```

---

## 🧪 Testing <a name="testing"></a>

La estructura de `test/` **refleja exactamente** la de `src/`, asegurando consistencia en todas las pruebas.  
Convenciones principales:

- Los tests unitarios usan el sufijo `*.spec.ts`.
- Cada módulo en `src/modules/` debe tener su espejo en `test/modules/`.
- Entidades, servicios, contratos, repositorios y controladores deben probarse de manera aislada.

### 📝 Guia para pruebas unitarias en NestJS

Las pruebas unitarias en NestJS se basan en **Jest** y en el uso del **módulo de pruebas de NestJS**
`(@nestjs/testing)`.
La idea es **probar una clase de forma aislada**, reemplazando sus dependencias con mocks.

**Estructura de una prueba unitaria**

```ts
/*1. NestJS proporciona @nestjs/testing para crear módulos de prueba que simulan el contenedor de dependencias (IoC container). */
import { Test, TestingModule } from '@nestjs/testing';

describe('NombreDeLaClase', () => {
  let clase: NombreDeLaClase;

  /* 2. Definir mocks de dependencias: En las pruebas unitarias no usamos implementaciones reales, sino objetos simulados (mocks) que reemplazan la lógica real.
        Estos mocks se definen con jest.fn().*/
  const mockDependencia = {
    metodo: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpia las llamadas previas de los mocks

    // 3. Construir el módulo de prueba: Creamos un TestingModule que registre el controlador y reemplace sus dependencias con los mocks.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NombreDeLaClase,
        { provide: DependenciaReal, useValue: mockDependencia },
      ],
    }).compile();

    // 4. Obtener la clase bajo prueba
    clase = module.get(NombreDeLaClase);
  });

  // 5. Escribir pruebas
  it('should be defined', () => {
    expect(clase).toBeDefined();
  });
});

```

---

## 🩺 Health Check <a name="health-check"></a>

Cada **proyecto debe exponer un endpoint de health** para verificar el estado de la aplicación y validar recursos
básicos como el uso de memoria.  
Este endpoint será utilizado en los **pipelines de CI/CD** para comprobar automáticamente que el servicio está
disponible y en condiciones óptimas antes y después de un despliegue.

- **Endpoint:** `/health`
- **Método:** `GET`
- **Respuesta esperada:**

```json
{
  "code": 200,
  "message": "api service running",
  "data": {
    "status": "ok",
    "info": {
      "memory_heap": {
        "status": "up",
        "used": 12345678,
        "limit": 314572800
      }
    },
    "error": {},
    "details": {
      "memory_heap": {
        "status": "up",
        "used": 12345678,
        "limit": 314572800
      }
    }
  }
}
```

---

## 🔒 Pre-commit Hook <a name="pre-commit"></a>

Todos los proyectos deben tener un pre-commit hook versionado en la carpeta githooks/.
Esto garantiza que cada commit cumpla con los estándares de calidad de Paprika.

### 📂 Instalación

Crear la carpeta `githooks/` en la raíz del proyecto.

Crear el archivo `githooks/pre-commit` con el siguiente contenido:

```sh
#!/bin/bash
# Pre-commit hook to validate code before committing.

set -e

echo "📢 Executing pre-commit validations..."

echo "🔍 Running ESLint..."
pnpm run lint

echo "💅 Verifying format with Prettier..."
pnpm run format:check

echo "🧪 Running unit tests..."
pnpm run test:cov

echo "✅ All pre-commit validators have passed."
```

Crear el archivo `/setup_hooks.sh` en la raiz del proyecto para configurar el precommit.

```sh
#!/bin/bash

echo "Setting up Git hooks path..."

echo "Adjusting execution permissions..."
chmod +x githooks/*

# Checks if the hooks folder has already been configured
if [ "$(git config core.hooksPath)" != "githooks" ]; then
  git config core.hooksPath githooks
  echo "Git hooks configured successfully."
else
  echo "Git hooks are already configured."
fi
```

---

## 🛠️ Next Steps <a name="next-steps"></a>

1. Empieza con el **Domain Guide** para definir entidades y reglas de negocio.
2. Pasa al **Application Guide** para implementar casos de uso y contratos.
3. Implementa los adaptadores en el **Infrastructure Guide**.
4. Expón la funcionalidad desde el **Interface Layer**.

---

✨ Juntas, estas capas forman el **esqueleto DDD de Paprika**, asegurando que cada módulo sea **escalable, testeable e
independiente**.
