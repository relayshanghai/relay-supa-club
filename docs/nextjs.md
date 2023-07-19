# API Body parsing

Note that you should not use `JSON.parse` to parse the body of a request if it has been sent with `'content-type': 'application/json'`. Just using `request.body` will parse the body correctly.
