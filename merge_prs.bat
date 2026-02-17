@echo off
for /l %%i in (7,1,24) do (
    echo Merging PR #%%i
    gh pr merge %%i --merge
)
