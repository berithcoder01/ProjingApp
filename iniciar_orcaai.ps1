# OrçaAI - Script de Inicialização Automática
# Execute: Clique duplo neste arquivo ou via PowerShell: .\iniciar_orcaai.ps1

$ErrorActionPreference = "Stop"

# Cores para output
$Green = [ConsoleColor]::Green
$Cyan = [ConsoleColor]::Cyan
$Yellow = [ConsoleColor]::Yellow

Write-Host ""
Write-Host "🚀 Iniciando OrçaAI..." -ForegroundColor $Green
Write-Host ""

# Definir caminhos (usando caminhos relativos ao script)
$projectRoot = $PSScriptRoot
$apiPath = Join-Path $projectRoot "api"
$appPath = Join-Path $projectRoot "app"

# Verificar se diretórios existem
if (!(Test-Path $apiPath)) {
    Write-Host "❌ Erro: Diretório da API não encontrado: $apiPath" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $appPath)) {
    Write-Host "❌ Erro: Diretório do App não encontrado: $appPath" -ForegroundColor Red
    exit 1
}

# 1. Iniciar API
Write-Host "📡 Iniciando API (Backend)..." -ForegroundColor $Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$apiPath'; npm run dev" -WindowStyle Minimized
Start-Sleep -Seconds 4

# 2. Iniciar Frontend
Write-Host "🌐 Iniciando Frontend (App)..." -ForegroundColor $Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$appPath'; npm run dev" -WindowStyle Minimized
Start-Sleep -Seconds 5

# 3. Abrir navegador
Write-Host "🌎 Abrindo navegador..." -ForegroundColor $Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ OrçaAI iniciado com sucesso!" -ForegroundColor $Green
Write-Host ""
Write-Host "   📡 API:    http://localhost:3000" -ForegroundColor $Yellow
Write-Host "   🌐 App:    http://localhost:5173" -ForegroundColor $Yellow
Write-Host ""
Write-Host "   Para parar os serviços, feche as janelas do PowerShell." -ForegroundColor $Cyan
Write-Host ""

# Manter script aberto (opcional)
Read-Host "Pressione Enter para sair"