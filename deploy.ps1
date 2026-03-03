# 1. Limpiar zip anterior si existe
if (Test-Path "deployment-package.zip") { Remove-Item "deployment-package.zip" }

Write-Host "--- Generando paquete de despliegue ---" -ForegroundColor Cyan
# 2. Generar el ZIP
Compress-Archive -Path "index.mjs", "node_modules" -DestinationPath "deployment-package.zip" -Force

Write-Host "--- Subiendo a AWS Lambda ---" -ForegroundColor Cyan
# 3. Actualizar el código en AWS
aws lambda update-function-code --function-name dev-tsb-lbm-crud --zip-file fileb://deployment-package.zip

Write-Host "--- Despliegue completado con éxito ---" -ForegroundColor Green