# Repo for reproduction of issue related to PW UI mode

## Steps to reproduce
1. Clone this repo
2. Run ```npm install```
3. Run ```npx playwright test --ui```
4. Run [example.spec.ts](tests%2Fexample.spec.ts)
5. Check execution and accessibility of PW actions in BeforeEach hook or tests step, they are not accessible
