# Script para criar atalho do OrçaAI na Área de Trabalho
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "OrçaAI.lnk"
$TargetPath = Join-Path $PSScriptRoot "Iniciar_OrçaAI.bat"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Iniciar Sistema OrçaAI"
# Usando o ícone do globo (Web) do Windows (shell32.dll, 14)
$Shortcut.IconLocation = "shell32.dll, 14"
$Shortcut.Save()

Write-Host ""
Write-Host "✅ Atalho 'OrçaAI' criado com sucesso na Área de Trabalho!" -ForegroundColor Green
Write-Host ""
