# 1. Limpiar archivos y carpetas previas de forma segura
if (Test-Path "deployment-package.zip") { 
    Remove-Item "deployment-package.zip" -Force 
}

# Borra 'dist' solo si existe para evitar errores en la consola
if (Test-Path "dist") { 
    Remove-Item -Recurse -Force "dist" 
}

Write-Host "--- 0. Instalando dependencias ---" -ForegroundColor Cyan
# Tip: 'npm install' puede ser lento. Si solo quieres asegurar que estén bien,
# puedes usar 'npm ci' si tienes un package-lock.json (es más rápido y limpio).
npm install

Write-Host "--- 1. Compilando TypeScript (Build) ---" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERR: Falló la compilación de TS" -ForegroundColor Red
    exit $LASTEXITCODE 
}

Write-Host "--- 2. Generando paquete ZIP ---" -ForegroundColor Cyan
npm run zip
if ($LASTEXITCODE -ne 0) { 
    Write-Host "ERR: Falló la creación del ZIP" -ForegroundColor Red
    exit $LASTEXITCODE 
}

Write-Host "--- 3. Subiendo a AWS Lambda ---" -ForegroundColor Cyan
aws lambda update-function-code --function-name dev-tsb-lbm-crud --zip-file fileb://deployment-package.zip

Write-Host "--- Despliegue completado con éxito ---" -ForegroundColor Green