@echo off
REM Nightly Blog Publish — called by Windows Task Scheduler at 00:00 IST
REM Logs are written to logs\nightly-publish.log

cd /d "C:\Users\bmnn1\OneDrive\Desktop\Offshore Marine Surveyors"
node scripts\nightly-publish.mjs
