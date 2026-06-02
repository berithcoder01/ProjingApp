@echo off
title OrçaAI - Inicializador
echo ========================================
echo        INICIANDO SISTEMA ORCAAI
echo ========================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0iniciar_orcaai.ps1"
echo.
echo Sessao finalizada.
pause
