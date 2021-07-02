import json
import random

def root_handler(event, context):
    print(event)
    print(context)
    return {"body": "success"}
