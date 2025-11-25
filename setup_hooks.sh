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