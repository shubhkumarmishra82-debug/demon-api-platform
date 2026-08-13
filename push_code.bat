@echo off
echo ==================================================
echo Pushing Demon API Platform to GitHub
echo Repository: https://github.com/shubhkumarmishra82-debug/demon-api-platform.git
echo ==================================================

git remote remove origin 2>nul
git remote add origin https://github.com/shubhkumarmishra82-debug/demon-api-platform.git
git branch -M main
git push -u origin main

pause
