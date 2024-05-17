## Description

Back-end assessment, written in TS with Nest

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

It will be available at port 3000

## Test

I left a few test cases, you can run it with

```bash
# unit tests
$ npm run test
```

## Using the API

Create a Business sending a **POST** to `/businessess` with the following payload

```json
{
    "name": "acme",
    "fein": 1
}
```
It will return a success response with the possible next states, e.g
```json
{
    "next": {
        "SalesDeclined": [
            "classification"
        ],
        "MarketDeclined": [
            "classification"
        ]
    },
    "previous": []
}
```
The array indicates the required fields for that step.

**I assumed a business can go back to a previous state with all current properties**


### Transition to next steps

To transition to other step send a **PUT** on `/businessess/:fein`, with the business entity adding the desired State. e.g:

```json
{
    "name": "acme",
    "fein": 2,
    "stage": "SalesDeclined",
    "classification": {
        "bureau": "bla",
        "classCode": "123"
    }
}
```

If you aren't able to jump to that Stage you'll get a 500 explaining the invalid transition

You can keep transitioning by calling the same API, just keep adding the required fields. e.g

```json
{
    "name": "acme",
    "fein": 2,
    "stage": "SalesApproved",
    "classification": {
        "bureau": "bla",
        "classCode": "123"
    },
    "phoneNumber": "+44 (223) 456-7890",
    "xMod": 123
}
```

Since you just hit the last step, you can only go back. So the response will be
```json
{
    "next": {},
    "previous": [
        "SalesDeclined"
    ]
}
```

To go back, just set the allowed state, I assumed you can do that (no need to remove any field)
```json
{
    "name": "acme",
    "fein": 2,
    "stage": "SalesDeclined",
    "classification": {
        "bureau": "bla",
        "classCode": "123"
    },
    "phoneNumber": "+44 (223) 456-7890",
    "xMod": 123
}
```


You can check the business state calling **GET** `/businessess` or `/businessess/:fein`


**PS** I didn't went deep dive into the unit tests, just left some basic scenarios to show I'm familiar with them.