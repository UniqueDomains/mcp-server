/*----------------------------------
- GENERATED: do not edit. `npm run generate` writes this file from @uniquedomains/sdk.
----------------------------------*/

import type { ToolDefinition } from '../tool';

/** The API document version and the SDK version the tools were generated from. */
export const TOOLS_DOCUMENT_VERSION = "1.0.0";
export const TOOLS_SDK_VERSION = "0.2.0";

/** Every tool of the server, in the document order. */
export const TOOLS: readonly ToolDefinition[] = [
    {
        "name": "ud_get_name",
        "operationId": "get_name",
        "title": "Stored answer for one domain name",
        "description": "The stored answer for one domain name: status, drop day, price today, registry facts, word facts and similar sales. Use it when someone asks about one specific domain name: whether it is open or for sale, what it costs, when it drops. Stored data as of its day, not a live reading. Pass `name` (such as get.plumbing).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, tracked, status, lifecycle, drop, ownableNow, price, registry, parking, length, format, shape, word, rating, verdict, value, comps."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "description": "`dom_<uuid>`; null when `tracked` is false.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "name": {
                            "type": "string"
                        },
                        "ending": {
                            "type": "string"
                        },
                        "tracked": {
                            "type": "boolean",
                            "description": "The catalog stores the name."
                        },
                        "status": {
                            "type": "string",
                            "description": "Where the name stands for a buyer. A list row's stored status reads here as: `resell` is `for_sale` (`at_auction` at a drop-catch venue), `premium` is `free_premium`."
                        },
                        "lifecycle": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "drop": {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "type": "string"
                                },
                                "dropsOn": {
                                    "type": "string"
                                }
                            }
                        },
                        "ownableNow": {
                            "type": "boolean"
                        },
                        "price": {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "firstYear": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registrar": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "renewal": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "transfer": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "isPromo": {
                                    "anyOf": [
                                        {
                                            "type": "boolean"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "renewalTrap": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "registry": {
                            "type": "object",
                            "properties": {
                                "createdAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "updatedAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "expiresAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registryUpdatedAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registrar": {
                                    "anyOf": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string"
                                                },
                                                "ianaId": {
                                                    "anyOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "url": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "parking": {
                            "description": "The parking or sale venue id.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "length": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "format": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "shape": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "word": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "word": {
                                            "type": "string"
                                        },
                                        "slug": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "rating": {
                            "type": "object",
                            "properties": {
                                "band": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "comps": {
                            "type": "object",
                            "properties": {
                                "tier": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "count": {
                                    "type": "integer"
                                },
                                "medianUsd": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "endingsSoldOn": {
                                    "type": "integer",
                                    "description": "Endings the word sold on in 12 months."
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_batch_names",
        "operationId": "batch_names",
        "title": "Stored answers for up to 100 domain names in one call",
        "description": "The stored answers for up to 100 domain names in one call. Use it when screening a list of names at once; each name is read as stored, not live. Pass `names` (a list).",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, tracked, status, lifecycle, drop, ownableNow, price, registry, parking, length, format, shape, word, rating, verdict, value, comps, error."
                },
                "names": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "names"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "anyOf": [
                            {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "description": "`dom_<uuid>`; null when `tracked` is false.",
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "ending": {
                                        "type": "string"
                                    },
                                    "tracked": {
                                        "type": "boolean",
                                        "description": "The catalog stores the name."
                                    },
                                    "status": {
                                        "type": "string"
                                    },
                                    "lifecycle": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "drop": {
                                        "type": "object",
                                        "properties": {
                                            "kind": {
                                                "type": "string"
                                            },
                                            "dropsOn": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "ownableNow": {
                                        "type": "boolean"
                                    },
                                    "price": {
                                        "type": "object",
                                        "properties": {
                                            "kind": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "firstYear": {
                                                "anyOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "registrar": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "renewal": {
                                                "anyOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "transfer": {
                                                "anyOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "isPromo": {
                                                "anyOf": [
                                                    {
                                                        "type": "boolean"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "renewalTrap": {
                                                "type": "boolean"
                                            },
                                            "regularPrice": {
                                                "description": "Keyed.",
                                                "anyOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    "registry": {
                                        "type": "object",
                                        "properties": {
                                            "createdAt": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "updatedAt": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "expiresAt": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "registryUpdatedAt": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "registrar": {
                                                "anyOf": [
                                                    {
                                                        "type": "object",
                                                        "properties": {
                                                            "name": {
                                                                "type": "string"
                                                            },
                                                            "ianaId": {
                                                                "anyOf": [
                                                                    {
                                                                        "type": "integer"
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            },
                                                            "url": {
                                                                "anyOf": [
                                                                    {
                                                                        "type": "string"
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    "parking": {
                                        "description": "The parking or sale venue id.",
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "length": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "format": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "shape": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "word": {
                                        "anyOf": [
                                            {
                                                "type": "object",
                                                "properties": {
                                                    "id": {
                                                        "type": "string"
                                                    },
                                                    "word": {
                                                        "type": "string"
                                                    },
                                                    "slug": {
                                                        "anyOf": [
                                                            {
                                                                "type": "string"
                                                            },
                                                            {
                                                                "type": "null"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "rating": {
                                        "type": "object",
                                        "properties": {
                                            "band": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "score": {
                                                "description": "Keyed, on this endpoint only.",
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    "verdict": {
                                        "description": "Keyed.",
                                        "anyOf": [
                                            {
                                                "type": "object",
                                                "properties": {
                                                    "rating": {
                                                        "type": "string"
                                                    },
                                                    "confidence": {
                                                        "anyOf": [
                                                            {
                                                                "type": "string"
                                                            },
                                                            {
                                                                "type": "null"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "value": {
                                        "description": "Keyed.",
                                        "anyOf": [
                                            {
                                                "type": "object",
                                                "properties": {
                                                    "value": {
                                                        "type": "integer"
                                                    },
                                                    "upsidePercent": {
                                                        "anyOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "null"
                                                            }
                                                        ]
                                                    },
                                                    "liquidity": {
                                                        "anyOf": [
                                                            {
                                                                "type": "string"
                                                            },
                                                            {
                                                                "type": "null"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "comps": {
                                        "type": "object",
                                        "properties": {
                                            "tier": {
                                                "description": "`sold_before` (this exact name sold before) on keyed answers only.",
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "count": {
                                                "type": "integer"
                                            },
                                            "medianUsd": {
                                                "anyOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "endingsSoldOn": {
                                                "type": "integer",
                                                "description": "Endings the word sold on in 12 months."
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string"
                                    },
                                    "tracked": {
                                        "type": "boolean",
                                        "description": "Always false here."
                                    }
                                }
                            },
                            {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string"
                                    },
                                    "error": {
                                        "type": "string"
                                    }
                                }
                            }
                        ]
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_check_name",
        "operationId": "check_name",
        "title": "Reads one name live from its registry and a registrar",
        "description": "Reads one name live from its registry and a registrar, stores the reading and returns the full name answer. Use it when the stored answer is too old for a decision about one name; each call spends one live check of the month. Pass `name` (such as get.plumbing).",
        "tier": "keyed",
        "plan": null,
        "metered": "Live",
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, tracked, status, lifecycle, drop, ownableNow, price, registry, parking, length, format, shape, word, rating, verdict, value, comps, checked."
                },
                "blocks": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "availability",
                            "registry",
                            "dns",
                            "prices",
                            "value",
                            "history"
                        ]
                    }
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "description": "`dom_<uuid>`; null when `tracked` is false.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "name": {
                            "type": "string"
                        },
                        "ending": {
                            "type": "string"
                        },
                        "tracked": {
                            "type": "boolean",
                            "description": "The catalog stores the name."
                        },
                        "status": {
                            "type": "string"
                        },
                        "lifecycle": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "drop": {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "type": "string"
                                },
                                "dropsOn": {
                                    "type": "string"
                                }
                            }
                        },
                        "ownableNow": {
                            "type": "boolean"
                        },
                        "price": {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "firstYear": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registrar": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "renewal": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "transfer": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "isPromo": {
                                    "anyOf": [
                                        {
                                            "type": "boolean"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "renewalTrap": {
                                    "type": "boolean"
                                },
                                "regularPrice": {
                                    "description": "Keyed.",
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "registry": {
                            "type": "object",
                            "properties": {
                                "createdAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "updatedAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "expiresAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registryUpdatedAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registrar": {
                                    "anyOf": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string"
                                                },
                                                "ianaId": {
                                                    "anyOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "url": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "parking": {
                            "description": "The parking or sale venue id.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "length": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "format": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "shape": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "word": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "word": {
                                            "type": "string"
                                        },
                                        "slug": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "rating": {
                            "type": "object",
                            "properties": {
                                "band": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "score": {
                                    "description": "Keyed, on this endpoint only.",
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "verdict": {
                            "description": "Keyed.",
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "rating": {
                                            "type": "string"
                                        },
                                        "confidence": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "value": {
                            "description": "Keyed.",
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "integer"
                                        },
                                        "upsidePercent": {
                                            "anyOf": [
                                                {
                                                    "type": "number"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "liquidity": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "comps": {
                            "type": "object",
                            "properties": {
                                "tier": {
                                    "description": "`sold_before` (this exact name sold before) on keyed answers only.",
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "count": {
                                    "type": "integer"
                                },
                                "medianUsd": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "endingsSoldOn": {
                                    "type": "integer",
                                    "description": "Endings the word sold on in 12 months."
                                }
                            }
                        },
                        "checked": {
                            "type": "boolean",
                            "description": "The live read answered."
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": false,
            "destructiveHint": false,
            "idempotentHint": false,
            "openWorldHint": true
        },
        "justification": {
            "readOnly": "Not read-only: it stores the fresh reading in the catalog and spends one Live unit of the member's month.",
            "openWorld": "Open world: it reads the name live from its public registry and a registrar.",
            "destructive": "Not destructive: it adds a reading and deletes or overwrites nothing the member made."
        }
    },
    {
        "name": "ud_get_name_prices",
        "operationId": "get_name_prices",
        "title": "Every stored registrar quote for one name",
        "description": "Every stored registrar quote for one name, and the renewal-trap flag. Use it when someone wants every registrar's price for one name, or asks whether its renewal jumps after the first year. Pass `name` (such as get.plumbing).",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: quotes, trap."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "quotes": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "registrar": {
                                        "type": "string"
                                    },
                                    "firstYear": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "renewal": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "transfer": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "regularPrice": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "isPromo": {
                                        "anyOf": [
                                            {
                                                "type": "boolean"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "currency": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "kind": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "trap": {
                            "type": "boolean"
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_registry",
        "operationId": "get_name_registry",
        "title": "Latest stored registry record of one name",
        "description": "The latest stored registry record of one name: dates, registrar, status codes, nameservers, DNSSEC and holder. Use it when someone asks who holds a name, when it was registered or when it expires. A stored record, not a live lookup. Pass `name` (such as get.plumbing).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: read, observedOn, observedAt, createdAt, updatedAt, expiresAt, registryUpdatedAt, registrar, eppStatuses, nameservers, dnssec, holder, transport."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "read": {
                            "type": "boolean"
                        },
                        "observedOn": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "createdAt": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "updatedAt": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "expiresAt": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "registryUpdatedAt": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "registrar": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "name": {
                                            "type": "string"
                                        },
                                        "ianaId": {
                                            "anyOf": [
                                                {
                                                    "type": "integer"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "url": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "eppStatuses": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "raw": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "nameservers": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "dnssec": {
                            "anyOf": [
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "holder": {
                            "type": "object",
                            "properties": {
                                "holder": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "redactedBy": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "heldAtRegistrar": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "transport": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_registry_history",
        "operationId": "get_name_registry_history",
        "title": "Stored registry record versions of one name and what moved between them",
        "description": "The stored registry record versions of one name and what moved between them. Use it when someone asks how a name's registration changed over time, such as a new registrar or a new expiry. Pass `name` (such as get.plumbing).",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: versions, moves, transfers, lockChanges."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "versions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "observedAt": {
                                        "type": "string"
                                    },
                                    "registrar": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "registered": {
                                        "anyOf": [
                                            {
                                                "type": "boolean"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "moves": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "at": {
                                        "type": "string"
                                    },
                                    "from": {
                                        "type": "string"
                                    },
                                    "to": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "transfers": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "at": {
                                        "type": "string"
                                    },
                                    "from": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "to": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "lockChanges": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "at": {
                                        "type": "string"
                                    },
                                    "kind": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_dns",
        "operationId": "get_name_dns",
        "title": "Latest stored DNS reading of one name",
        "description": "The latest stored DNS reading of one name, with its parking venue. Use it when someone asks whether a name points anywhere or is parked, and with which parking service. Pass `name` (such as get.plumbing).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: read, ns, a, aaaa, cname, mx, hasWebsite, parking."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "read": {
                            "type": "boolean"
                        },
                        "ns": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "a": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "aaaa": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "cname": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "mx": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "exchange": {
                                        "type": "string"
                                    },
                                    "priority": {
                                        "type": "integer"
                                    }
                                }
                            }
                        },
                        "hasWebsite": {
                            "anyOf": [
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "parking": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_name_changes",
        "operationId": "list_name_changes",
        "title": "Change events of one name, newest first",
        "description": "The change events of one name, newest first. Use it when someone wants the timeline of one name's events; it answers one page at a time. Pass `name` (such as get.plumbing); the other inputs are optional.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "types": {
                    "type": "string",
                    "description": "Comma list of change types (default all): price_drop, price_increase, status_change, expiry_window, lifecycle_move, registrar_change, transfer, lock_removed, renewal_observed, nameserver_change, parking_change, auction_ending, auction_jump."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, type, observedAt, subject, before, after, expiresAt."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "observedAt": {
                                "type": "string"
                            },
                            "subject": {
                                "type": "object",
                                "properties": {
                                    "kind": {
                                        "type": "string"
                                    },
                                    "key": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            },
                            "before": {
                                "anyOf": [
                                    {
                                        "type": "object"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "after": {
                                "anyOf": [
                                    {
                                        "type": "object"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "expiresAt": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_history",
        "operationId": "get_name_history",
        "title": "Web history of one name in bands",
        "description": "The web history of one name in bands: archive captures, authority band and language. Use it when someone asks whether a name carried a website before and how established it was. Pass `name` (such as get.plumbing).",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: hadWebsite, firstCaptureYear, lastCaptureYear, captures, authorityBand, language."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "hadWebsite": {
                            "anyOf": [
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "firstCaptureYear": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "lastCaptureYear": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "captures": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "authorityBand": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "language": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_value",
        "operationId": "get_name_value",
        "title": "Stored value estimate of one name and its last 20 estimates",
        "description": "The stored value estimate of one name and its last 20 estimates. Use it when someone asks what a name is worth; it reads the stored estimate and runs no new one. Pass `name` (such as get.plumbing).",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: current, history."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "current": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "integer"
                                        },
                                        "asOf": {
                                            "type": "string"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "history": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "value": {
                                        "type": "integer"
                                    },
                                    "date": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_appraise_name",
        "operationId": "appraise_name",
        "title": "Runs the appraisal of one stored name when its estimate is missing",
        "description": "Runs the appraisal of one stored name when its estimate is missing, and returns the value estimate. Use it when a name has no stored estimate yet; each call spends one appraisal of the month. Pass `name` (such as get.plumbing).",
        "tier": "keyed",
        "plan": "investor",
        "metered": "Appraisal",
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: current, history."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "current": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "integer"
                                        },
                                        "asOf": {
                                            "type": "string"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "history": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "value": {
                                        "type": "integer"
                                    },
                                    "date": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": false,
            "destructiveHint": false,
            "idempotentHint": false,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Not read-only: it runs and stores the appraisal of a stored name and spends one Appraisal unit of the member's month.",
            "openWorld": "Closed world: it works on the Unique Domains catalog only.",
            "destructive": "Not destructive: it adds to the catalog and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_comps",
        "operationId": "get_name_comps",
        "title": "Similar-sales aggregate of one name and how many endings its word sold on",
        "description": "The similar-sales aggregate of one name and how many endings its word sold on. Use it when someone asks what similar names sold for, or on how many endings the word sold. Pass `name` (such as get.plumbing).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: tier, count, medianUsd, endingsSoldOn."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "tier": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "count": {
                            "type": "integer"
                        },
                        "medianUsd": {
                            "anyOf": [
                                {
                                    "type": "number"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "endingsSoldOn": {
                            "type": "integer",
                            "description": "Endings the word sold on in 12 months."
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_name_auction",
        "operationId": "get_name_auction",
        "title": "Open auction of one name, if any",
        "description": "The open auction of one name, if any: venue, deadline, bid and the first-year cost. Use it when someone asks whether a name is at auction now, its current bid or its deadline. Pass `name` (such as get.plumbing).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason, and a suggestion when there is one."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: venue, venueLabel, endsAt, bid, bidCount, currency, firstYear, bidsJumped."
                }
            },
            "required": [
                "name"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "venue": {
                                    "type": "string"
                                },
                                "venueLabel": {
                                    "type": "string"
                                },
                                "endsAt": {
                                    "type": "string"
                                },
                                "bid": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "bidCount": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "currency": {
                                    "type": "string"
                                },
                                "firstYear": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "bidsJumped": {
                                    "type": "boolean"
                                }
                            }
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_resolve_word",
        "operationId": "resolve_word",
        "title": "Turns what a caller typed into the catalog word it names",
        "description": "Turns what a caller typed into the catalog word it names, or up to five candidates. Use it first when a word is misspelled, plural or unclear, to find the catalog word the word tools take. Pass `q` (such as harbors).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "q": {
                    "type": "string",
                    "description": "What the caller typed, 1 to 255 characters."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: match, candidates."
                }
            },
            "required": [
                "q"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "match": {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "string",
                                    "description": "`wrd_<id>`."
                                },
                                "slug": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "word": {
                                    "type": "string"
                                },
                                "shape": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "origin": {
                                    "type": "string"
                                },
                                "via": {
                                    "type": "string"
                                }
                            }
                        },
                        "candidates": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string",
                                        "description": "`wrd_<id>`."
                                    },
                                    "slug": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "word": {
                                        "type": "string"
                                    },
                                    "shape": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "origin": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_word_categories",
        "operationId": "list_word_categories",
        "title": "Catalog's word categories, by name",
        "description": "The catalog's word categories, by name. Use it when someone wants the word categories to browse or filter by. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "slug": {
                                "type": "string"
                            },
                            "name": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_batch_words",
        "operationId": "batch_words",
        "title": "Up to 100 word profiles in one call",
        "description": "Up to 100 word profiles in one call. Use it when comparing a list of words at once. Pass `words` (a list).",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, word, slug, shape, pos, definition, inflected, size, popularity, sentiment, brandability, style, categories, denyClass, origin, addedAt, linguistics, found."
                },
                "words": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "words"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "anyOf": [
                            {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string",
                                        "description": "`wrd_<id>`."
                                    },
                                    "word": {
                                        "type": "string"
                                    },
                                    "slug": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "shape": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "pos": {
                                        "description": "Parts of speech as stored, comma-joined tags.",
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "definition": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "inflected": {
                                        "anyOf": [
                                            {
                                                "type": "boolean"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "size": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "popularity": {
                                        "description": "How widely the word is used; never sales or demand.",
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "sentiment": {
                                        "description": "50 is neutral.",
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "brandability": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "style": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "categories": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "slug": {
                                                    "type": "string"
                                                },
                                                "name": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    "denyClass": {
                                        "description": "Why the word stays off public lists; null when none.",
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "origin": {
                                        "type": "string"
                                    },
                                    "addedAt": {
                                        "description": "When the intake added it; null means the dictionary load.",
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "linguistics": {
                                        "type": "object",
                                        "properties": {
                                            "lookalikeIsLookalike": {
                                                "anyOf": [
                                                    {
                                                        "type": "boolean"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "lookalikeNormalized": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "memorabilityFamiliarity": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "memorabilityLabel": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "memorabilityNeighbors": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "memorabilityScore": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronounceabilityLabel": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronounceabilityPhonotactic": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronounceabilityScore": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronunciationArpabet": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronunciationConfidence": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronunciationIpa": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronunciationStressPattern": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "pronunciationSyllables": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "soundTextureLabel": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "soundTextureSharpness": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "soundTextureSoftness": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "spellingHomophones": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "spellingLabel": {
                                                "anyOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "spellingLikelyMisspellings": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },
                                            "spellingRisk": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "spellingSoundalikes": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "type": "object",
                                "properties": {
                                    "word": {
                                        "type": "string"
                                    },
                                    "found": {
                                        "type": "boolean",
                                        "description": "Always false on a miss."
                                    }
                                }
                            }
                        ]
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_words",
        "operationId": "list_words",
        "title": "Searches the catalog's words by text and facets",
        "description": "Searches the catalog's words by text and facets, alphabetically. Use it when looking for words by meaning, length, style or category; it answers one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "q": {
                    "type": "string",
                    "description": "A prefix of the word."
                },
                "contains": {
                    "type": "string",
                    "description": "A substring of the word."
                },
                "pos": {
                    "type": "string",
                    "description": "A part-of-speech tag as stored (`noun`, `verb`, `adjective`, ...)."
                },
                "shape": {
                    "type": "string",
                    "enum": [
                        "single",
                        "properNoun",
                        "acronym",
                        "twoWords",
                        "phrase"
                    ],
                    "description": "The entry's shape."
                },
                "minLength": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 63,
                    "description": "Shortest length."
                },
                "maxLength": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 63,
                    "description": "Longest length."
                },
                "popularityMin": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100,
                    "description": "Lowest popularity (how widely the word is used)."
                },
                "popularityMax": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100,
                    "description": "Highest popularity."
                },
                "sentimentMin": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100,
                    "description": "Lowest sentiment (50 is neutral)."
                },
                "sentimentMax": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100,
                    "description": "Highest sentiment."
                },
                "style": {
                    "type": "string",
                    "enum": [
                        "modern",
                        "elegant",
                        "slab",
                        "handwritten",
                        "playful",
                        "futuristic"
                    ],
                    "description": "The word's type style."
                },
                "syllables": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 20,
                    "description": "Syllable count."
                },
                "origin": {
                    "type": "string",
                    "enum": [
                        "dictionary",
                        "trend",
                        "api",
                        "review"
                    ],
                    "description": "How the word entered the catalog."
                },
                "category": {
                    "type": "string",
                    "description": "A word category slug, as the word categories list names it."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, slug, word, shape, pos, size, origin."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "slug": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "word": {
                                "type": "string"
                            },
                            "shape": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "pos": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "size": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "origin": {
                                "type": "string"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_word",
        "operationId": "get_word",
        "title": "A word's profile",
        "description": "A word's profile: definition, facets, categories, origin and linguistics. Use it when someone asks what a word means, where it comes from or how it is used. Pass `word` (such as harbor).",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, word, slug, shape, pos, definition, inflected, size, popularity, sentiment, brandability, style, categories, denyClass, origin, addedAt, linguistics."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "`wrd_<id>`."
                        },
                        "word": {
                            "type": "string"
                        },
                        "slug": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "shape": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "pos": {
                            "description": "Parts of speech as stored, comma-joined tags.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "definition": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "inflected": {
                            "anyOf": [
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "size": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "popularity": {
                            "description": "How widely the word is used; never sales or demand.",
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "sentiment": {
                            "description": "50 is neutral.",
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "brandability": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "style": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "categories": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "slug": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "denyClass": {
                            "description": "Why the word stays off public lists; null when none.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "origin": {
                            "type": "string"
                        },
                        "addedAt": {
                            "description": "When the intake added it; null means the dictionary load.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "linguistics": {
                            "type": "object",
                            "properties": {
                                "lookalikeIsLookalike": {
                                    "anyOf": [
                                        {
                                            "type": "boolean"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "lookalikeNormalized": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "memorabilityFamiliarity": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "memorabilityLabel": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "memorabilityNeighbors": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "memorabilityScore": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronounceabilityLabel": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronounceabilityPhonotactic": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronounceabilityScore": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronunciationArpabet": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronunciationConfidence": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronunciationIpa": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronunciationStressPattern": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "pronunciationSyllables": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "soundTextureLabel": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "soundTextureSharpness": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "soundTextureSoftness": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "spellingHomophones": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "spellingLabel": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "spellingLikelyMisspellings": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "spellingRisk": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "spellingSoundalikes": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_word_endings",
        "operationId": "get_word_endings",
        "title": "A word's endings as stored on the latest day",
        "description": "A word's endings as stored on the latest day: counts, the key endings and the open names per ending. Use it when someone has a word and asks which endings are still open for it, such as harbor.ai. A word with no count (not scanned, or not counted yet) answers null; zeros are real. Pass `word` (such as harbor); the other inputs are optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: byGroup, keyEndings, openByEnding, cheapest."
                },
                "include": {
                    "type": "string",
                    "description": "Comma-separated optional blocks: cheapest (paid)."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [
            "include"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "byGroup": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "scanned": {
                                            "type": "integer"
                                        },
                                        "taken": {
                                            "type": "integer"
                                        },
                                        "available": {
                                            "type": "integer"
                                        },
                                        "forSale": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "keyEndings": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "ending": {
                                        "type": "string"
                                    },
                                    "status": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "price": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "openByEnding": {
                            "description": "`{ ending: count }`.",
                            "anyOf": [
                                {
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "integer"
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_word_names",
        "operationId": "list_word_names",
        "title": "A word's catalog names on the endings that sell, by name",
        "description": "A word's catalog names on the endings that sell, by name. Use it when someone wants every catalog name built on one word; it answers one page at a time. Pass `word` (such as harbor); the other inputs are optional.",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, status, price, renewal, registrar, expires, parking, lifecycle, dropsOn, created."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "`dom_<uuid>`."
                            },
                            "name": {
                                "type": "string"
                            },
                            "ending": {
                                "type": "string"
                            },
                            "status": {
                                "type": "string"
                            },
                            "price": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewal": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "registrar": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "expires": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "parking": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "lifecycle": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "dropsOn": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "created": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_word_trademarks",
        "operationId": "get_word_trademarks",
        "title": "A word's trademark counts and its exact-match marks",
        "description": "A word's trademark counts and its exact-match marks. Use it when someone asks whether a word is a registered trademark before choosing a name. Pass `word` (such as harbor); the other inputs are optional.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "office": {
                    "type": "string",
                    "enum": [
                        "US",
                        "EU"
                    ],
                    "description": "Keep the marks of one office."
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "live",
                        "dead"
                    ],
                    "description": "Keep live or dead marks."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: us, eu, marks."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "us": {
                            "type": "object",
                            "properties": {
                                "liveCount": {
                                    "type": "integer"
                                },
                                "classes": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "eu": {
                            "type": "object",
                            "properties": {
                                "liveCount": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "classes": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "marks": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "office": {
                                        "type": "string"
                                    },
                                    "serial": {
                                        "type": "string"
                                    },
                                    "mark": {
                                        "type": "string"
                                    },
                                    "registration": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "status": {
                                        "type": "string"
                                    },
                                    "owner": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "filed": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "registered": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "niceClasses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "goods": {
                                        "description": "At most 500 characters, live trademarks only.",
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "url": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_word_notability",
        "operationId": "get_word_notability",
        "title": "A word's Wikipedia and Wikidata facts",
        "description": "A word's Wikipedia and Wikidata facts. Use it when someone asks how widely known a word is as a public topic. Pass `word` (such as harbor).",
        "tier": "free",
        "plan": "investor",
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: wikipediaTitle, backlinks, languages, wikidataId, description."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "wikipediaTitle": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "backlinks": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "languages": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "wikidataId": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "description": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_word_market",
        "operationId": "get_word_market",
        "title": "A word's stored sales and auction aggregates",
        "description": "A word's stored sales and auction aggregates. Use it when someone asks how a word sells across endings: counts, prices and auctions. Pass `word` (such as harbor).",
        "tier": "free",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: sales12m, sales30d, medianFromThree, endingsSoldOn, openAuctionsByEnding."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "sales12m": {
                            "type": "integer"
                        },
                        "sales30d": {
                            "type": "integer"
                        },
                        "medianFromThree": {
                            "description": "USD, only from 3 sales.",
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "endingsSoldOn": {
                            "type": "integer"
                        },
                        "openAuctionsByEnding": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "integer"
                            },
                            "description": "`{ ending: count }`."
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_related_words",
        "operationId": "list_related_words",
        "title": "A word's synonyms then related words",
        "description": "A word's synonyms then related words, closest first, with their open names. Use it when the first word is taken and someone wants close alternatives that still have open names. Pass `word` (such as harbor); the other inputs are optional.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20,
                    "description": "Rows, 1 to 50."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: word, slug, relation, openNames."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "word": {
                                "type": "string"
                            },
                            "slug": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "relation": {
                                "type": "string"
                            },
                            "openNames": {
                                "description": "Open to register plus for sale; null: not counted yet.",
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_word_fits",
        "operationId": "list_word_fits",
        "title": "How well the word fits each ending whose keywords list it",
        "description": "How well the word fits each ending whose keywords list it. Use it when someone asks which endings suit a word. Pass `word` (such as harbor); the other inputs are optional.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The catalog slug, the word, or `wrd_<id>`."
                },
                "tld": {
                    "type": "string",
                    "description": "One bare ending."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20,
                    "description": "Rows, 1 to 50."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: ending, fit, basis."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ending": {
                                "type": "string"
                            },
                            "fit": {
                                "type": "integer"
                            },
                            "basis": {
                                "type": "string"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_request_word",
        "operationId": "request_word",
        "title": "Brings a word into the catalog",
        "description": "Brings a word into the catalog: checks it now and queues an accepted word for the intake. Use it when a word is missing from the catalog and should join it; each call counts against the month's word requests. Pass `word` (such as glimmerly).",
        "tier": "keyed",
        "plan": "investor",
        "metered": "Intake",
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "One lowercase word of 2 to 63 letters a to z; no slug or id form."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string"
                        },
                        "requestId": {
                            "type": "string",
                            "description": "On `accepted` and `queued`."
                        },
                        "poll": {
                            "type": "string",
                            "description": "`/v1/words/requests/<requestId>`; on `accepted`."
                        },
                        "word": {
                            "type": "object",
                            "description": "On `in_catalog`.",
                            "properties": {
                                "id": {
                                    "type": "string",
                                    "description": "`wrd_<id>`."
                                },
                                "slug": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "origin": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": false,
            "destructiveHint": false,
            "idempotentHint": false,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Not read-only: it queues the word for the catalog intake and spends one Intake unit of the member's month.",
            "openWorld": "Closed world: it works on the Unique Domains catalog only.",
            "destructive": "Not destructive: it adds to the catalog and deletes nothing."
        }
    },
    {
        "name": "ud_get_word_request",
        "operationId": "get_word_request",
        "title": "State of a word request",
        "description": "The state of a word request: queued, ready with its catalog word, refused or failed. Use it to follow a word request until its word is ready. Pass `requestId` (such as 6b0f6e3c-1d2a-4f6e-9a51-0c7d3b8e2f44).",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "requestId": {
                    "type": "string",
                    "description": "The id the request answered."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: requestId, status, word, scan, reason, requestedAt, resolvedAt."
                }
            },
            "required": [
                "requestId"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "requestId": {
                            "type": "string"
                        },
                        "status": {
                            "type": "string"
                        },
                        "word": {
                            "description": "On `ready`; null when the catalog no longer serves the word.",
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "string",
                                            "description": "`wrd_<id>`."
                                        },
                                        "slug": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "scan": {
                            "type": "string",
                            "description": "On `ready` with a word: whether the first scan of every ending ran."
                        },
                        "reason": {
                            "type": "string",
                            "description": "On `rejected`."
                        },
                        "requestedAt": {
                            "type": "string"
                        },
                        "resolvedAt": {
                            "description": "Null while queued.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_domains",
        "operationId": "list_domains",
        "title": "One-word catalog names under filters",
        "description": "One-word catalog names under filters. Use it when someone wants one-word names matching filters such as ending, length or price. Neutral order, one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "ending": {
                    "type": "string",
                    "description": "Comma list of endings without the dot."
                },
                "status": {
                    "type": "string",
                    "description": "Comma list of statuses: available, premium, resell, expiring, expired, taken, dormant, sold, unknown. Default: available, premium, resell."
                },
                "lengthMin": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 63,
                    "description": "Shortest word, in characters."
                },
                "lengthMax": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 63,
                    "description": "Longest word, in characters."
                },
                "shape": {
                    "type": "string",
                    "description": "Comma list of word shapes: single, properNoun, acronym, twoWords, phrase. A proper noun is left out of an answer without a key."
                },
                "style": {
                    "type": "string",
                    "description": "Comma list of styles: modern, elegant, slab, handwritten, playful, futuristic."
                },
                "format": {
                    "type": "string",
                    "enum": [
                        "oneWord",
                        "hack"
                    ],
                    "description": "One word, or domain hacks."
                },
                "priceMax": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Highest price today, USD."
                },
                "renewalMax": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Highest renewal, USD."
                },
                "prefix": {
                    "type": "string",
                    "description": "The word starts with. Paid subscriptions only."
                },
                "contains": {
                    "type": "string",
                    "description": "The word contains. Paid subscriptions only."
                },
                "pos": {
                    "type": "string",
                    "description": "Comma list of parts of speech: adjective, adjective satellite, adverb, conjunction, contraction, determiner, interjection, letter, noun, particle, pnoun, pnound, preposition, prepPhrase, pronoun, proverb, symbol, verb, unknown."
                },
                "expiresBefore": {
                    "type": "string",
                    "description": "Registry expiry on or before this day."
                },
                "sort": {
                    "type": "string",
                    "description": "A neutral order: askPrice, price, renewal, seoRandomKey, domain; prefix `-` for descending. Without it, the engine's own order. No quality order exists. Paid subscriptions only."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, status, price, priceKind, renewal, ratingBand, format, shape, length, coverage, value, upsidePercent, liquidity, verdict."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [
            "prefix",
            "contains",
            "sort"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "`dom_<uuid>`."
                            },
                            "name": {
                                "type": "string"
                            },
                            "ending": {
                                "type": "string"
                            },
                            "status": {
                                "type": "string",
                                "description": "The stored status of the row. One name's own answer groups it for a buyer: `resell` reads `for_sale` there (`at_auction` at a drop-catch venue), `premium` reads `free_premium`."
                            },
                            "price": {
                                "description": "Price today, USD.",
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "priceKind": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewal": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "ratingBand": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "format": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "shape": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "length": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "coverage": {
                                "description": "The same word on other endings: available, premium, for sale.",
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "available": {
                                                "type": "integer"
                                            },
                                            "premium": {
                                                "type": "integer"
                                            },
                                            "forSale": {
                                                "type": "integer"
                                            },
                                            "unavailable": {
                                                "type": "integer"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_domain",
        "operationId": "get_domain",
        "title": "One catalog name, by name or catalog id",
        "description": "One catalog name, by name or catalog id. Use it when someone asks about one catalog name and holds its name or its catalog id. Pass `nameOrId` (such as get.plumbing).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "nameOrId": {
                    "type": "string",
                    "description": "A lowercase name or `dom_<uuid>`."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, tracked, status, lifecycle, drop, ownableNow, price, registry, parking, length, format, shape, word, rating, verdict, value, comps."
                }
            },
            "required": [
                "nameOrId"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "description": "`dom_<uuid>`; null when `tracked` is false.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "name": {
                            "type": "string"
                        },
                        "ending": {
                            "type": "string"
                        },
                        "tracked": {
                            "type": "boolean",
                            "description": "The catalog stores the name."
                        },
                        "status": {
                            "type": "string"
                        },
                        "lifecycle": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "drop": {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "type": "string"
                                },
                                "dropsOn": {
                                    "type": "string"
                                }
                            }
                        },
                        "ownableNow": {
                            "type": "boolean"
                        },
                        "price": {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "firstYear": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registrar": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "renewal": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "transfer": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "isPromo": {
                                    "anyOf": [
                                        {
                                            "type": "boolean"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "renewalTrap": {
                                    "type": "boolean"
                                }
                            }
                        },
                        "registry": {
                            "type": "object",
                            "properties": {
                                "createdAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "updatedAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "expiresAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registryUpdatedAt": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registrar": {
                                    "anyOf": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string"
                                                },
                                                "ianaId": {
                                                    "anyOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "url": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "parking": {
                            "description": "The parking or sale venue id.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "length": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "format": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "shape": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "word": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "word": {
                                            "type": "string"
                                        },
                                        "slug": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "rating": {
                            "type": "object",
                            "properties": {
                                "band": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            }
                        },
                        "comps": {
                            "type": "object",
                            "properties": {
                                "tier": {
                                    "anyOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "count": {
                                    "type": "integer"
                                },
                                "medianUsd": {
                                    "anyOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "endingsSoldOn": {
                                    "type": "integer",
                                    "description": "Endings the word sold on in 12 months."
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_expiring_domains",
        "operationId": "list_expiring_domains",
        "title": "Catalog names expiring or expired, by expiry day",
        "description": "Catalog names expiring or expired, by expiry day. Use it when someone wants names whose registration is about to run out, by day. Every input is optional; `limit` sets the page size.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "ending": {
                    "type": "string",
                    "description": "Comma list of endings without the dot."
                },
                "after": {
                    "type": "string",
                    "description": "Expiry on or after this day."
                },
                "before": {
                    "type": "string",
                    "description": "Expiry before this day."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, status, expiresOn, dropsOn, registrar, price."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "ending": {
                                "type": "string"
                            },
                            "status": {
                                "type": "string"
                            },
                            "expiresOn": {
                                "type": "string"
                            },
                            "dropsOn": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "registrar": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "price": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_domain_drops",
        "operationId": "get_domain_drops",
        "title": "Names dropping on one day, counted by ending",
        "description": "The names dropping on one day, counted by ending. Use it when someone asks how many names drop on a given day, and on which endings. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "day": {
                    "type": "string",
                    "description": "The drop day, UTC; default today."
                },
                "ending": {
                    "type": "string",
                    "description": "Comma list of endings without the dot. Paid subscriptions only."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: count, byEnding, sample, id, name, ending, dropsOn, status."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [
            "ending"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "count": {
                                    "type": "integer"
                                },
                                "byEnding": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "ending": {
                                                "type": "string"
                                            },
                                            "count": {
                                                "type": "integer"
                                            }
                                        }
                                    }
                                },
                                "sample": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "ending": {
                                                "type": "string"
                                            },
                                            "dropsOn": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "ending": {
                                        "type": "string"
                                    },
                                    "dropsOn": {
                                        "type": "string"
                                    },
                                    "status": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    ]
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_domain_hacks",
        "operationId": "list_domain_hacks",
        "title": "Domain hacks",
        "description": "Domain hacks: names whose ending completes the word. Use it when someone wants a short name in which the ending spells the last letters of the word. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "ending": {
                    "type": "string",
                    "description": "Comma list of endings without the dot."
                },
                "status": {
                    "type": "string",
                    "description": "Comma list of statuses: available, premium, resell, expiring, expired, taken, dormant, sold, unknown. Default: available, premium, resell."
                },
                "lengthMin": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 63,
                    "description": "Shortest word, in characters."
                },
                "lengthMax": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 63,
                    "description": "Longest word, in characters."
                },
                "shape": {
                    "type": "string",
                    "description": "Comma list of word shapes: single, properNoun, acronym, twoWords, phrase. A proper noun is left out of an answer without a key."
                },
                "style": {
                    "type": "string",
                    "description": "Comma list of styles: modern, elegant, slab, handwritten, playful, futuristic."
                },
                "priceMax": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Highest price today, USD."
                },
                "renewalMax": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Highest renewal, USD."
                },
                "prefix": {
                    "type": "string",
                    "description": "The word starts with. Paid subscriptions only."
                },
                "contains": {
                    "type": "string",
                    "description": "The word contains. Paid subscriptions only."
                },
                "pos": {
                    "type": "string",
                    "description": "Comma list of parts of speech: adjective, adjective satellite, adverb, conjunction, contraction, determiner, interjection, letter, noun, particle, pnoun, pnound, preposition, prepPhrase, pronoun, proverb, symbol, verb, unknown."
                },
                "expiresBefore": {
                    "type": "string",
                    "description": "Registry expiry on or before this day."
                },
                "sort": {
                    "type": "string",
                    "description": "A neutral order: askPrice, price, renewal, seoRandomKey, domain; prefix `-` for descending. Without it, the engine's own order. No quality order exists. Paid subscriptions only."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, ending, status, price, priceKind, renewal, ratingBand, format, shape, length, coverage, value, upsidePercent, liquidity, verdict."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [
            "prefix",
            "contains",
            "sort"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "`dom_<uuid>`."
                            },
                            "name": {
                                "type": "string"
                            },
                            "ending": {
                                "type": "string"
                            },
                            "status": {
                                "type": "string",
                                "description": "The stored status of the row. One name's own answer groups it for a buyer: `resell` reads `for_sale` there (`at_auction` at a drop-catch venue), `premium` reads `free_premium`."
                            },
                            "price": {
                                "description": "Price today, USD.",
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "priceKind": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewal": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "ratingBand": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "format": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "shape": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "length": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "coverage": {
                                "description": "The same word on other endings: available, premium, for sale.",
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "available": {
                                                "type": "integer"
                                            },
                                            "premium": {
                                                "type": "integer"
                                            },
                                            "forSale": {
                                                "type": "integer"
                                            },
                                            "unavailable": {
                                                "type": "integer"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_domain_changes",
        "operationId": "list_domain_changes",
        "title": "Changes across the catalog's names, newest first",
        "description": "Changes across the catalog's names, newest first. Use it when following what changed across names since a day; it answers one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "types": {
                    "type": "string",
                    "description": "Comma list of change types (default all): price_drop, price_increase, status_change, expiry_window, lifecycle_move, registrar_change, transfer, lock_removed, renewal_observed, nameserver_change, parking_change, auction_ending, auction_jump."
                },
                "ending": {
                    "type": "string",
                    "description": "Comma list of endings without the dot."
                },
                "since": {
                    "type": "string",
                    "description": "Events observed at or after this time, oldest first."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, type, observedAt, subject, before, after, expiresAt."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "observedAt": {
                                "type": "string"
                            },
                            "subject": {
                                "type": "object",
                                "properties": {
                                    "kind": {
                                        "type": "string"
                                    },
                                    "key": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            },
                            "before": {
                                "anyOf": [
                                    {
                                        "type": "object"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "after": {
                                "anyOf": [
                                    {
                                        "type": "object"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "expiresAt": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_catalog_stats",
        "operationId": "get_catalog_stats",
        "title": "Catalog headline totals for the latest day",
        "description": "Catalog headline totals for the latest day. Use it when someone asks how many names the catalog tracks and how many are open. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: day, domains, words, tlds."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "day": {
                            "type": "string"
                        },
                        "domains": {
                            "type": "object",
                            "properties": {
                                "total": {
                                    "type": "integer"
                                },
                                "available": {
                                    "type": "integer"
                                },
                                "registered": {
                                    "type": "integer"
                                },
                                "premium": {
                                    "type": "integer"
                                },
                                "resell": {
                                    "type": "integer"
                                },
                                "expiring": {
                                    "type": "integer"
                                },
                                "expired": {
                                    "type": "integer"
                                }
                            }
                        },
                        "words": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "tlds": {
                            "type": "integer"
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tlds",
        "operationId": "list_tlds",
        "title": "Every root TLD with its registry facts and launch phases",
        "description": "Every root TLD with its registry facts and launch phases, alphabetical. Use it when someone wants to browse endings by type, country or status; it answers one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "ianaType": {
                    "type": "string",
                    "description": "IANA's own type word (`generic`, `country-code`, `sponsored`, `infrastructure`)."
                },
                "ianaStatus": {
                    "type": "string",
                    "enum": [
                        "delegated",
                        "removed",
                        "never_delegated"
                    ],
                    "description": "IANA root zone status."
                },
                "country": {
                    "type": "string",
                    "description": "The registry operator's country, ISO 3166-1 alpha-2."
                },
                "isBrand": {
                    "type": "boolean",
                    "description": "Brand TLDs only (`true`) or none (`false`)."
                },
                "isIdn": {
                    "type": "boolean",
                    "description": "Internationalised endings only (`true`) or none (`false`)."
                },
                "publicSet": {
                    "type": "boolean",
                    "description": "`true`: only the endings with a public page on unique.domains."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: tld, slug, ianaStatus, kind, ianaType, registryOperator, registryCountryCode, isBrand, isIdn, delegatedOn, removedOn, contractTerminated, rdapServer, category, phases, insights."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "tld": {
                                "type": "string",
                                "description": "The ending with its dot (`.ai`)."
                            },
                            "slug": {
                                "type": "string",
                                "description": "The bare ending, the row key and cursor key."
                            },
                            "ianaStatus": {
                                "anyOf": [
                                    {
                                        "description": "IANA root zone status."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "kind": {
                                "description": "Catalog kind."
                            },
                            "ianaType": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "IANA's type word."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "registryOperator": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "Registry operator."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "registryCountryCode": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "Operator country, ISO 3166-1 alpha-2."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "isBrand": {
                                "type": "boolean",
                                "description": "Brand TLD (Specification 13)."
                            },
                            "isIdn": {
                                "type": "boolean",
                                "description": "Internationalised ending."
                            },
                            "delegatedOn": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "Day of delegation."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "removedOn": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "Day of removal from the root."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "contractTerminated": {
                                "type": "boolean",
                                "description": "Registry agreement terminated."
                            },
                            "rdapServer": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "`TLDs.rdapServer`, the registry's RDAP server."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "category": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "`TLDs.category`, the catalog's category word."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "phases": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "string",
                                            "description": "`TldLaunchPhase.id`."
                                        },
                                        "phase": {},
                                        "startsOn": {
                                            "type": "string",
                                            "description": "First day."
                                        },
                                        "endsOn": {
                                            "anyOf": [
                                                {
                                                    "type": "string",
                                                    "description": "Last day, null when open-ended."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "programLabel": {
                                            "anyOf": [
                                                {
                                                    "type": "string",
                                                    "description": "The limited program's own name."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            "insights": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "insightUrl": {
                                                "type": "string"
                                            },
                                            "market": {
                                                "anyOf": [
                                                    {
                                                        "type": "object",
                                                        "properties": {
                                                            "computedAt": {
                                                                "type": "string",
                                                                "description": "When these figures were computed."
                                                            },
                                                            "availableOneWord": {
                                                                "type": "integer",
                                                                "description": "One-word names available on the ending."
                                                            },
                                                            "registrations90d": {
                                                                "type": "integer",
                                                                "description": "Names registered in 90 days among those tracked."
                                                            },
                                                            "medianBuy": {
                                                                "anyOf": [
                                                                    {
                                                                        "type": "number",
                                                                        "description": "Median first-year price."
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            },
                                                            "medianRenew": {
                                                                "anyOf": [
                                                                    {
                                                                        "type": "number",
                                                                        "description": "Median renewal price."
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            },
                                                            "cheapestRegistrar": {
                                                                "anyOf": [
                                                                    {
                                                                        "type": "string",
                                                                        "description": "Registrar catalog slug of the cheapest first year."
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            },
                                                            "sales12m": {
                                                                "type": "integer",
                                                                "description": "Usable sales, rolling 365 days."
                                                            },
                                                            "salesMedian12mUsd": {
                                                                "anyOf": [
                                                                    {
                                                                        "type": "integer",
                                                                        "description": "Median sale over 12 months, from three sales."
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            },
                                                            "salesTrend": {
                                                                "anyOf": [
                                                                    {
                                                                        "description": "12-month count against the previous 12 months, ±10 % threshold."
                                                                    },
                                                                    {
                                                                        "type": "null"
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_tld",
        "operationId": "get_tld",
        "title": "One TLD in full",
        "description": "One TLD in full: registry facts, phases, market, quality band and registrar prices. Use it when someone asks about one ending: who runs it, its launch phases, its market and its prices. Pass `tld` (such as ai).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`), ASCII or `xn--` form; lowercased, a leading dot stripped."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, registry, phases, market, quality, registrars, githubRepoUrl."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "slug": {
                            "type": "string"
                        },
                        "registry": {
                            "type": "object",
                            "properties": {
                                "slug": {
                                    "type": "string"
                                },
                                "ianaStatus": {
                                    "anyOf": [
                                        {
                                            "description": "IANA root zone status."
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "kind": {
                                    "description": "Catalog kind."
                                },
                                "ianaType": {
                                    "anyOf": [
                                        {
                                            "type": "string",
                                            "description": "IANA's type word."
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registryOperator": {
                                    "anyOf": [
                                        {
                                            "type": "string",
                                            "description": "Registry operator."
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "registryCountryCode": {
                                    "anyOf": [
                                        {
                                            "type": "string",
                                            "description": "Operator country, ISO 3166-1 alpha-2."
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "isBrand": {
                                    "type": "boolean",
                                    "description": "Brand TLD (Specification 13)."
                                },
                                "isIdn": {
                                    "type": "boolean",
                                    "description": "Internationalised ending."
                                },
                                "delegatedOn": {
                                    "anyOf": [
                                        {
                                            "type": "string",
                                            "description": "Day of delegation."
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "removedOn": {
                                    "anyOf": [
                                        {
                                            "type": "string",
                                            "description": "Day of removal from the root."
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "contractTerminated": {
                                    "type": "boolean",
                                    "description": "Registry agreement terminated."
                                }
                            }
                        },
                        "phases": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string",
                                        "description": "`TldLaunchPhase.id`."
                                    },
                                    "phase": {},
                                    "startsOn": {
                                        "type": "string",
                                        "description": "First day."
                                    },
                                    "endsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string",
                                                "description": "Last day, null when open-ended."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "programLabel": {
                                        "anyOf": [
                                            {
                                                "type": "string",
                                                "description": "The limited program's own name."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "market": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "computedAt": {
                                            "type": "string",
                                            "description": "When these figures were computed."
                                        },
                                        "availableOneWord": {
                                            "type": "integer",
                                            "description": "One-word names available on the ending."
                                        },
                                        "registrations90d": {
                                            "type": "integer",
                                            "description": "Names registered in 90 days among those tracked."
                                        },
                                        "medianBuy": {
                                            "anyOf": [
                                                {
                                                    "type": "number",
                                                    "description": "Median first-year price."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "medianRenew": {
                                            "anyOf": [
                                                {
                                                    "type": "number",
                                                    "description": "Median renewal price."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "cheapestRegistrar": {
                                            "anyOf": [
                                                {
                                                    "type": "string",
                                                    "description": "Registrar catalog slug of the cheapest first year."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "sales12m": {
                                            "type": "integer",
                                            "description": "Usable sales, rolling 365 days."
                                        },
                                        "salesMedian12mUsd": {
                                            "anyOf": [
                                                {
                                                    "type": "integer",
                                                    "description": "Median sale over 12 months, from three sales."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "salesTrend": {
                                            "anyOf": [
                                                {
                                                    "description": "12-month count against the previous 12 months, ±10 % threshold."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "tracked": {
                                            "type": "integer",
                                            "description": "Names tracked on the ending."
                                        },
                                        "available": {
                                            "type": "integer",
                                            "description": "Tracked names available."
                                        },
                                        "resell": {
                                            "type": "integer",
                                            "description": "Tracked names listed for resale."
                                        },
                                        "expiring90d": {
                                            "type": "integer",
                                            "description": "Tracked names expiring within 90 days."
                                        },
                                        "salesMonthly": {
                                            "anyOf": [
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "from": {
                                                            "type": "string",
                                                            "description": "Month of the first count, `YYYY-MM`."
                                                        },
                                                        "counts": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "integer"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "quality": {},
                        "registrars": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "registrar": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "homepageUrl": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "purchasePrice": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "renewalPrice": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "renewalTrap": {
                                        "type": "boolean",
                                        "description": "Renewal at least twice the first year and $10 more."
                                    },
                                    "cheapest": {
                                        "type": "boolean",
                                        "description": "Lowest first year of this list."
                                    }
                                }
                            }
                        },
                        "githubRepoUrl": {
                            "anyOf": [
                                {
                                    "type": "string",
                                    "description": "The ending's dataset repository when live and not archived."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_tld_stats",
        "operationId": "get_tld_stats",
        "title": "Ending's latest market figures",
        "description": "The ending's latest market figures, and with history its last daily rows. Use it when someone asks how one ending's market is doing, such as its registrations or sales over time. Pass `tld` (such as ai); the other inputs are optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`), ASCII or `xn--` form; lowercased, a leading dot stripped."
                },
                "history": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 90,
                    "description": "Days of daily rows, newest first; absent = the latest row only."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: tld, day, computedAt, tracked, available, availableOneWord, resell, expiring90d, registrations90d, medianBuy, medianRenew, cheapestRegistrar, sales12m, salesPrev12m, salesMedian12m, salesTrend, salesMonthly, sales30d, salesMedian30d, salesMedianPrev12m, panel, history."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "tld": {
                            "type": "string",
                            "description": "Bare ending."
                        },
                        "day": {
                            "type": "string",
                            "description": "The day of these figures."
                        },
                        "computedAt": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "tracked": {
                            "type": "integer"
                        },
                        "available": {
                            "type": "integer"
                        },
                        "availableOneWord": {
                            "type": "integer"
                        },
                        "resell": {
                            "type": "integer"
                        },
                        "expiring90d": {
                            "type": "integer"
                        },
                        "registrations90d": {
                            "type": "integer"
                        },
                        "medianBuy": {
                            "anyOf": [
                                {
                                    "type": "number"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "medianRenew": {
                            "anyOf": [
                                {
                                    "type": "number"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cheapestRegistrar": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "sales12m": {
                            "type": "integer",
                            "description": "Usable sales, 365 days."
                        },
                        "salesPrev12m": {
                            "type": "integer",
                            "description": "The 365 days before."
                        },
                        "salesMedian12m": {
                            "anyOf": [
                                {
                                    "type": "integer",
                                    "description": "Median sale, 12 months (USD)."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "salesTrend": {
                            "anyOf": [
                                {
                                    "description": "12-month count against the previous 12 months, ±10 % threshold."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "salesMonthly": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "from": {
                                            "type": "string",
                                            "description": "Month of the first count, `YYYY-MM`."
                                        },
                                        "counts": {
                                            "type": "array",
                                            "items": {
                                                "type": "integer"
                                            }
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "sales30d": {
                            "type": "integer",
                            "description": "Usable sales, 30 days."
                        },
                        "salesMedian30d": {
                            "anyOf": [
                                {
                                    "type": "integer",
                                    "description": "Median sale, 30 days (USD)."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "salesMedianPrev12m": {
                            "anyOf": [
                                {
                                    "type": "integer",
                                    "description": "Median of the previous 12 months (USD)."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "panel": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "names": {
                                            "type": "integer"
                                        },
                                        "available": {
                                            "type": "integer"
                                        },
                                        "resell": {
                                            "type": "integer"
                                        },
                                        "expiring90d": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "history": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "tld": {
                                        "type": "string",
                                        "description": "Bare ending."
                                    },
                                    "day": {
                                        "type": "string",
                                        "description": "The day of these figures."
                                    },
                                    "computedAt": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "tracked": {
                                        "type": "integer"
                                    },
                                    "available": {
                                        "type": "integer"
                                    },
                                    "availableOneWord": {
                                        "type": "integer"
                                    },
                                    "resell": {
                                        "type": "integer"
                                    },
                                    "expiring90d": {
                                        "type": "integer"
                                    },
                                    "registrations90d": {
                                        "type": "integer"
                                    },
                                    "medianBuy": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "medianRenew": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "cheapestRegistrar": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "sales12m": {
                                        "type": "integer",
                                        "description": "Usable sales, 365 days."
                                    },
                                    "salesPrev12m": {
                                        "type": "integer",
                                        "description": "The 365 days before."
                                    },
                                    "salesMedian12m": {
                                        "anyOf": [
                                            {
                                                "type": "integer",
                                                "description": "Median sale, 12 months (USD)."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "salesTrend": {
                                        "anyOf": [
                                            {
                                                "description": "12-month count against the previous 12 months, ±10 % threshold."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "salesMonthly": {
                                        "anyOf": [
                                            {
                                                "type": "object",
                                                "properties": {
                                                    "from": {
                                                        "type": "string",
                                                        "description": "Month of the first count, `YYYY-MM`."
                                                    },
                                                    "counts": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "integer"
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "sales30d": {
                                        "type": "integer",
                                        "description": "Usable sales, 30 days."
                                    },
                                    "salesMedian30d": {
                                        "anyOf": [
                                            {
                                                "type": "integer",
                                                "description": "Median sale, 30 days (USD)."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "salesMedianPrev12m": {
                                        "anyOf": [
                                            {
                                                "type": "integer",
                                                "description": "Median of the previous 12 months (USD)."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "panel": {
                                        "anyOf": [
                                            {
                                                "type": "object",
                                                "properties": {
                                                    "names": {
                                                        "type": "integer"
                                                    },
                                                    "available": {
                                                        "type": "integer"
                                                    },
                                                    "resell": {
                                                        "type": "integer"
                                                    },
                                                    "expiring90d": {
                                                        "type": "integer"
                                                    }
                                                }
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_phases",
        "operationId": "list_tld_phases",
        "title": "Every dated launch phase of the ending, chronological",
        "description": "Every dated launch phase of the ending, chronological. Use it when someone asks when an ending opens, such as its sunrise or general availability dates. Pass `tld` (such as ai).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`), ASCII or `xn--` form; lowercased, a leading dot stripped."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, phase, startsOn, endsOn, programLabel."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "`TldLaunchPhase.id`."
                            },
                            "phase": {},
                            "startsOn": {
                                "type": "string",
                                "description": "First day."
                            },
                            "endsOn": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "Last day, null when open-ended."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "programLabel": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "The limited program's own name."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_changes",
        "operationId": "list_tld_changes",
        "title": "Ending's public registry changes, newest first",
        "description": "The ending's public registry changes, newest first. Use it when someone asks what changed at an ending's registry lately. Pass `tld` (such as ai); the other inputs are optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`), ASCII or `xn--` form; lowercased, a leading dot stripped."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: kind, after, seenOn."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "kind": {},
                            "after": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "description": "`{ contractTerminated }` on `contract_termination`, `{ phaseWithdrawn }` on `phase_moved`."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "seenOn": {
                                "type": "string",
                                "description": "UTC day the scanner saw the change."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_keywords",
        "operationId": "list_tld_keywords",
        "title": "Keywords the catalog attaches to the ending, by type",
        "description": "The keywords the catalog attaches to the ending, by type. Use it when someone asks which words or topics an ending suits. Pass `tld` (such as ai); the other inputs are optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`), ASCII or `xn--` form; lowercased, a leading dot stripped."
                },
                "type": {
                    "type": "string",
                    "enum": [
                        "semantic",
                        "activity",
                        "location",
                        "audience",
                        "intent",
                        "tone",
                        "lexical"
                    ],
                    "description": "`semantic` or one facet."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: type, keyword, power."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string"
                            },
                            "keyword": {
                                "type": "string"
                            },
                            "power": {
                                "type": "integer",
                                "description": "The strength of the keyword for the ending."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_applications",
        "operationId": "list_tld_applications",
        "title": "2026 new gTLD round as ICANN publishes it",
        "description": "The 2026 new gTLD round as ICANN publishes it, A to Z, with two simple bands. Use it when someone asks who applied for new endings in the 2026 round, or which strings are contested. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "q": {
                    "type": "string",
                    "description": "The string, its U-label, the applicant, the contention set or the country contains this text."
                },
                "type": {
                    "type": "string",
                    "enum": [
                        "standard",
                        "brand",
                        "community",
                        "geographic"
                    ],
                    "description": "The boards' reading of ICANN's type."
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "initial_evaluation",
                        "withdrawn",
                        "objection_filed",
                        "early_warning"
                    ],
                    "description": "The boards' reading of ICANN's status."
                },
                "contention": {
                    "type": "string",
                    "enum": [
                        "set",
                        "none"
                    ],
                    "description": "In a contention set, or not."
                },
                "word": {
                    "type": "boolean",
                    "description": "The string is a word of the catalog's corpus."
                },
                "pop": {
                    "type": "string",
                    "enum": [
                        "low",
                        "medium",
                        "high"
                    ],
                    "description": "Word popularity band."
                },
                "sales": {
                    "type": "string",
                    "enum": [
                        "none",
                        "low",
                        "medium",
                        "high"
                    ],
                    "description": "Comparable sales band."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: applicationId, string, uLabel, applicant, applicantCountryCode, type, status, contentionSet, announcedOn, wordPopularityBand, comparableSalesBand, typeKey, statusKey, setSize, applicantCount, inWordCorpus."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "applicationId": {
                                "type": "string",
                                "description": "ICANN application id, the row key."
                            },
                            "string": {
                                "type": "string",
                                "description": "Applied-for string, ASCII (A-label for IDNs), lowercased."
                            },
                            "uLabel": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "Unicode form of an IDN."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "applicant": {
                                "type": "string",
                                "description": "Applicant as ICANN names it."
                            },
                            "applicantCountryCode": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "type": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "ICANN's own type wording."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "status": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "ICANN's own status wording."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "contentionSet": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "announcedOn": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "ICANN's publication day."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "wordPopularityBand": {
                                "anyOf": [
                                    {},
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "comparableSalesBand": {
                                "anyOf": [
                                    {},
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "typeKey": {
                                "anyOf": [
                                    {},
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "statusKey": {
                                "anyOf": [
                                    {},
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "setSize": {
                                "type": "integer",
                                "description": "Applications in the row's contention set; 0 when uncontested."
                            },
                            "applicantCount": {
                                "type": "integer",
                                "description": "Applications the same applicant filed in the round."
                            },
                            "inWordCorpus": {
                                "anyOf": [
                                    {
                                        "type": "boolean",
                                        "description": "The string is a word of the catalog's corpus."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_application_changes",
        "operationId": "list_tld_application_changes",
        "title": "Every recorded status or contention change of the round",
        "description": "Every recorded status or contention change of the round, newest first. Use it when someone asks what moved in the 2026 round lately, such as a withdrawal or a contention change. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "enum": [
                        "status",
                        "contention_set"
                    ],
                    "description": "What changed."
                },
                "since": {
                    "type": "string",
                    "description": "A day or an ISO 8601 timestamp: changes seen at or after it."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: applicationId, string, kind, before, after, seenAt."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "applicationId": {
                                "type": "string"
                            },
                            "string": {
                                "type": "string"
                            },
                            "kind": {},
                            "before": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "after": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "seenAt": {
                                "type": "string",
                                "description": "Timestamp the import saw it."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_tld_application_string",
        "operationId": "get_tld_application_string",
        "title": "One applied-for string",
        "description": "One applied-for string: its applications and its change history. Use it when someone asks about one applied-for ending, such as who applied for it. Pass `string` (such as account).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "string": {
                    "type": "string",
                    "description": "The applied-for string, lowercased ASCII (an IDN as its A-label)."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: string, applications, changes."
                }
            },
            "required": [
                "string"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "string": {
                            "type": "string"
                        },
                        "applications": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "applicationId": {
                                        "type": "string",
                                        "description": "ICANN application id, the row key."
                                    },
                                    "string": {
                                        "type": "string",
                                        "description": "Applied-for string, ASCII (A-label for IDNs), lowercased."
                                    },
                                    "uLabel": {
                                        "anyOf": [
                                            {
                                                "type": "string",
                                                "description": "Unicode form of an IDN."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "applicant": {
                                        "type": "string",
                                        "description": "Applicant as ICANN names it."
                                    },
                                    "applicantCountryCode": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "type": {
                                        "anyOf": [
                                            {
                                                "type": "string",
                                                "description": "ICANN's own type wording."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "status": {
                                        "anyOf": [
                                            {
                                                "type": "string",
                                                "description": "ICANN's own status wording."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "contentionSet": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "announcedOn": {
                                        "anyOf": [
                                            {
                                                "type": "string",
                                                "description": "ICANN's publication day."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "wordPopularityBand": {
                                        "anyOf": [
                                            {},
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "comparableSalesBand": {
                                        "anyOf": [
                                            {},
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "typeKey": {
                                        "anyOf": [
                                            {},
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "statusKey": {
                                        "anyOf": [
                                            {},
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "setSize": {
                                        "type": "integer",
                                        "description": "Applications in the row's contention set; 0 when uncontested."
                                    },
                                    "applicantCount": {
                                        "type": "integer",
                                        "description": "Applications the same applicant filed in the round."
                                    },
                                    "inWordCorpus": {
                                        "anyOf": [
                                            {
                                                "type": "boolean",
                                                "description": "The string is a word of the catalog's corpus."
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "changes": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "applicationId": {
                                        "type": "string"
                                    },
                                    "string": {
                                        "type": "string"
                                    },
                                    "kind": {},
                                    "before": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "after": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "seenAt": {
                                        "type": "string",
                                        "description": "Timestamp the import saw it."
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_registrars",
        "operationId": "list_registrars",
        "title": "Nine registrars whose daily price lists are compared",
        "description": "The nine registrars whose daily price lists are compared, in catalog order. Use it when someone asks which registrars the price comparisons cover. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name, kind, ianaId, accredited, homepageUrl, siteUrl, logoUrl, endingsPriced."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "slug": {
                                "type": "string",
                                "description": "Catalog slug."
                            },
                            "name": {
                                "type": "string",
                                "description": "Display name."
                            },
                            "kind": {
                                "type": "string",
                                "description": "`registrar`, or a venue's kind (`marketplace`, `parking`, `dropcatch`)."
                            },
                            "ianaId": {
                                "anyOf": [
                                    {
                                        "type": "integer",
                                        "description": "IANA registrar id."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "accredited": {
                                "type": "boolean",
                                "description": "The IANA record says accredited."
                            },
                            "homepageUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ],
                                "description": "The registrar's or venue's homepage, with no tracking query."
                            },
                            "siteUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ],
                                "description": "The same homepage as `homepageUrl`."
                            },
                            "logoUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "endingsPriced": {
                                "type": "integer",
                                "description": "IANA-delegated endings it prices."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_registrar_prices",
        "operationId": "list_registrar_prices",
        "title": "A registrar's list prices, alphabetical by ending",
        "description": "A registrar's list prices, alphabetical by ending. Use it when someone asks what one registrar charges for its endings, first year and renewal. Pass `registrar` (such as namecheap); the other inputs are optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "registrar": {
                    "type": "string",
                    "enum": [
                        "namecheap",
                        "name.com",
                        "namesilo",
                        "porkbun",
                        "dynadot",
                        "cloudflare",
                        "spaceship",
                        "godaddy",
                        "unstoppable"
                    ],
                    "description": "A registrar catalog slug of the nine, exactly (`name.com`, no `name-com` alias)."
                },
                "delisted": {
                    "type": "boolean",
                    "description": "`true`: the endings its last complete list no longer carries. Paid subscriptions only."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: extension, purchasePrice, renewalPrice, transferPrice, isPromo, currency, delisted."
                }
            },
            "required": [
                "registrar"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [
            "delisted",
            "limit",
            "cursor"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "extension": {
                                "type": "string",
                                "description": "Bare ending, the row key."
                            },
                            "purchasePrice": {
                                "anyOf": [
                                    {
                                        "type": "number",
                                        "description": "First year, in `currency`."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewalPrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "transferPrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "isPromo": {
                                "anyOf": [
                                    {
                                        "type": "boolean",
                                        "description": "The first year is a promotion."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "currency": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "ISO 4217."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "delisted": {
                                "type": "boolean"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_registrar_changes",
        "operationId": "list_registrar_changes",
        "title": "A registrar's confirmed list-price changes, newest first",
        "description": "A registrar's confirmed list-price changes, newest first. Use it when someone asks how one registrar's prices changed lately. Pass `registrar` (such as namecheap).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "registrar": {
                    "type": "string",
                    "enum": [
                        "namecheap",
                        "name.com",
                        "namesilo",
                        "porkbun",
                        "dynadot",
                        "cloudflare",
                        "spaceship",
                        "godaddy",
                        "unstoppable"
                    ],
                    "description": "A registrar catalog slug of the nine, exactly (`name.com`, no `name-com` alias)."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, extension, registrar, registrarName, field, oldPrice, newPrice, currency, confirmedAt."
                }
            },
            "required": [
                "registrar"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [
            "limit",
            "cursor"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "`TldPriceChange.id` as a string."
                            },
                            "extension": {
                                "type": "string",
                                "description": "Bare ending."
                            },
                            "registrar": {
                                "type": "string",
                                "description": "Registrar slug."
                            },
                            "registrarName": {
                                "type": "string",
                                "description": "Display name."
                            },
                            "field": {
                                "description": "Which price moved."
                            },
                            "oldPrice": {
                                "type": "number",
                                "description": "Before."
                            },
                            "newPrice": {
                                "type": "number",
                                "description": "After."
                            },
                            "currency": {
                                "type": "string",
                                "description": "ISO 4217."
                            },
                            "confirmedAt": {
                                "type": "string",
                                "description": "Confirmation timestamp."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_registrar_footprint",
        "operationId": "get_registrar_footprint",
        "title": "Names tracked under the registrar on the latest footprint day",
        "description": "Names tracked under the registrar on the latest footprint day, rounded, with its top endings. Use it when someone asks how many names a registrar holds and on which endings. Pass `registrar` (such as namecheap).",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "registrar": {
                    "type": "string",
                    "enum": [
                        "namecheap",
                        "name.com",
                        "namesilo",
                        "porkbun",
                        "dynadot",
                        "cloudflare",
                        "spaceship",
                        "godaddy",
                        "unstoppable"
                    ],
                    "description": "A registrar catalog slug of the nine, exactly (`name.com`, no `name-com` alias)."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: registrar, day, names, topEndings."
                }
            },
            "required": [
                "registrar"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "registrar": {
                            "type": "string"
                        },
                        "day": {
                            "type": "string"
                        },
                        "names": {
                            "anyOf": [
                                {
                                    "type": "integer",
                                    "description": "Rounded (to 100, to 10 under 1,000); null when it rounds to 0."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "topEndings": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "ending": {
                                        "type": "string"
                                    },
                                    "names": {
                                        "type": "integer",
                                        "description": "Rounded count on the ending."
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_prices",
        "operationId": "list_tld_prices",
        "title": "Every registrar's list price for one ending",
        "description": "Every registrar's list price for one ending, with the cheapest and trap marks. Use it when someone asks where one ending is cheapest to register or to renew. Pass `tld` (such as io).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`); lowercased, a leading dot stripped."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: registrar, name, homepageUrl, purchasePrice, renewalPrice, transferPrice, currency, isPromo, regularPurchasePrice, renewalTrap, cheapest, cheapestRenewal, cheapestTransfer."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "registrar": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "homepageUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "purchasePrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewalPrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "transferPrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "currency": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "isPromo": {
                                "type": "boolean",
                                "description": "First year is a promotion."
                            },
                            "regularPurchasePrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewalTrap": {
                                "type": "boolean",
                                "description": "Renewal at least twice the first year and $10 more."
                            },
                            "cheapest": {
                                "type": "boolean",
                                "description": "Lowest first year."
                            },
                            "cheapestRenewal": {
                                "type": "boolean",
                                "description": "Lowest renewal."
                            },
                            "cheapestTransfer": {
                                "type": "boolean",
                                "description": "Lowest transfer-in."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_tld_price_history",
        "operationId": "list_tld_price_history",
        "title": "Change-only price rows of one ending, newest first",
        "description": "Change-only price rows of one ending, newest first. Use it when someone asks how one ending's price moved over time. Pass `tld` (such as io); the other inputs are optional.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tld": {
                    "type": "string",
                    "description": "The ending without the dot (`ai`); lowercased, a leading dot stripped."
                },
                "registrar": {
                    "type": "string",
                    "description": "A registrar catalog slug."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: registrar, currency, purchasePrice, regularPurchasePrice, renewalPrice, transferPrice, isPromo, firstSeenAt, lastSeenAt, observations."
                }
            },
            "required": [
                "tld"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "registrar": {
                                "type": "string"
                            },
                            "currency": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "purchasePrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "regularPurchasePrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "renewalPrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "transferPrice": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "isPromo": {
                                "anyOf": [
                                    {
                                        "type": "boolean"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "firstSeenAt": {
                                "type": "string",
                                "description": "First observation of this price set."
                            },
                            "lastSeenAt": {
                                "type": "string",
                                "description": "Last observation."
                            },
                            "observations": {
                                "type": "integer",
                                "description": "Reads that saw it."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_price_changes",
        "operationId": "list_price_changes",
        "title": "Confirmed registrar price changes across the nine",
        "description": "Confirmed registrar price changes across the nine, newest first. Use it when someone asks which registrar prices changed lately. Every input is optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "ending": {
                    "type": "string",
                    "description": "A bare ending. Paid subscriptions only."
                },
                "registrar": {
                    "type": "string",
                    "enum": [
                        "namecheap",
                        "name.com",
                        "namesilo",
                        "porkbun",
                        "dynadot",
                        "cloudflare",
                        "spaceship",
                        "godaddy",
                        "unstoppable"
                    ],
                    "description": "A registrar slug. Paid subscriptions only."
                },
                "field": {
                    "type": "string",
                    "enum": [
                        "purchase",
                        "renewal",
                        "transfer"
                    ],
                    "description": "Which price moved. Paid subscriptions only."
                },
                "since": {
                    "type": "string",
                    "description": "A day or an ISO 8601 timestamp: confirmed at or after it. Paid subscriptions only."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, extension, registrar, registrarName, field, oldPrice, newPrice, currency, confirmedAt."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [
            "ending",
            "registrar",
            "field",
            "since",
            "limit",
            "cursor"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "`TldPriceChange.id` as a string."
                            },
                            "extension": {
                                "type": "string",
                                "description": "Bare ending."
                            },
                            "registrar": {
                                "type": "string",
                                "description": "Registrar slug."
                            },
                            "registrarName": {
                                "type": "string",
                                "description": "Display name."
                            },
                            "field": {
                                "description": "Which price moved."
                            },
                            "oldPrice": {
                                "type": "number",
                                "description": "Before."
                            },
                            "newPrice": {
                                "type": "number",
                                "description": "After."
                            },
                            "currency": {
                                "type": "string",
                                "description": "ISO 4217."
                            },
                            "confirmedAt": {
                                "type": "string",
                                "description": "Confirmation timestamp."
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_price_traps",
        "operationId": "list_price_traps",
        "title": "Endings whose cheapest first year renews at a trap price",
        "description": "Endings whose cheapest first year renews at a trap price, alphabetical. Use it when someone wants to avoid endings that are cheap the first year and costly to renew. Every input is optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: tld, multiple, cheapestYearOne, cheapestRenewalElsewhere."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [
            "limit",
            "cursor"
        ],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "tld": {
                                "type": "string",
                                "description": "Bare ending."
                            },
                            "multiple": {
                                "type": "number",
                                "description": "The cheapest first year's renewal over that first year, one decimal."
                            },
                            "cheapestYearOne": {
                                "type": "object",
                                "properties": {
                                    "registrar": {
                                        "type": "string"
                                    },
                                    "price": {
                                        "type": "number"
                                    },
                                    "renewal": {
                                        "type": "number"
                                    }
                                }
                            },
                            "cheapestRenewalElsewhere": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "registrar": {
                                                "type": "string"
                                            },
                                            "renewal": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_cheapest_prices",
        "operationId": "list_cheapest_prices",
        "title": "Cheapest registrar per ending for up to 100 endings",
        "description": "The cheapest registrar per ending for up to 100 endings. Use it when comparing where a list of endings is cheapest, all at once. Pass `tlds` (such as ai,io).",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "tlds": {
                    "type": "string",
                    "description": "Comma-separated bare endings, 1 to 100, duplicates folded."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: ending, cheapestYear1, cheapestRenewal, cheapestTransfer, trap."
                }
            },
            "required": [
                "tlds"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ending": {
                                "type": "string"
                            },
                            "cheapestYear1": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "registrar": {
                                                "type": "string"
                                            },
                                            "price": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "cheapestRenewal": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "registrar": {
                                                "type": "string"
                                            },
                                            "price": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "cheapestTransfer": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "registrar": {
                                                "type": "string"
                                            },
                                            "price": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "trap": {
                                "anyOf": [
                                    {
                                        "type": "boolean"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_venues",
        "operationId": "list_venues",
        "title": "Parking and marketplace venues with a profile and their rounded footprint",
        "description": "The parking and marketplace venues with a profile and their rounded footprint. Use it when someone asks which marketplaces or parking services list names, and how many. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name, kind, ianaId, accredited, homepageUrl, siteUrl, logoUrl, footprint."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "slug": {
                                "type": "string",
                                "description": "Catalog slug."
                            },
                            "name": {
                                "type": "string",
                                "description": "Display name."
                            },
                            "kind": {
                                "type": "string",
                                "description": "`registrar`, or a venue's kind (`marketplace`, `parking`, `dropcatch`)."
                            },
                            "ianaId": {
                                "anyOf": [
                                    {
                                        "type": "integer",
                                        "description": "IANA registrar id."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "accredited": {
                                "type": "boolean",
                                "description": "The IANA record says accredited."
                            },
                            "homepageUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ],
                                "description": "The registrar's or venue's homepage, with no tracking query."
                            },
                            "siteUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ],
                                "description": "The same homepage as `homepageUrl`."
                            },
                            "logoUrl": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "footprint": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "names": {
                                                "type": "integer",
                                                "description": "Scanned names parked at the venue, rounded (to 100, to 10 under 1,000)."
                                            },
                                            "listed": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer",
                                                        "description": "Of them listed for sale, rounded; marketplaces only."
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "parked": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer",
                                                        "description": "Of them parked only, rounded; marketplaces only."
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "arrivalsWeek": {
                                                "type": "integer",
                                                "description": "Names that arrived over the last seven days."
                                            },
                                            "departuresWeek": {
                                                "type": "integer",
                                                "description": "Names that left over the last seven days."
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_venue",
        "operationId": "get_venue",
        "title": "One venue's profile with its verified listing terms",
        "description": "One venue's profile with its verified listing terms. Use it when someone asks about one marketplace's or parking service's terms, such as its commission. Pass `id` (such as afternic).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "A parking catalog id (`afternic`, `atom`, `sedo`, `dan`, ...)."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name, kind, ianaId, accredited, homepageUrl, siteUrl, logoUrl, footprint, footprintDay, listingTerms."
                }
            },
            "required": [
                "id"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "slug": {
                            "type": "string",
                            "description": "Catalog slug."
                        },
                        "name": {
                            "type": "string",
                            "description": "Display name."
                        },
                        "kind": {
                            "type": "string",
                            "description": "`registrar`, or a venue's kind (`marketplace`, `parking`, `dropcatch`)."
                        },
                        "ianaId": {
                            "anyOf": [
                                {
                                    "type": "integer",
                                    "description": "IANA registrar id."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "accredited": {
                            "type": "boolean",
                            "description": "The IANA record says accredited."
                        },
                        "homepageUrl": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ],
                            "description": "The registrar's or venue's homepage, with no tracking query."
                        },
                        "siteUrl": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ],
                            "description": "The same homepage as `homepageUrl`."
                        },
                        "logoUrl": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "footprint": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "names": {
                                            "type": "integer",
                                            "description": "Scanned names parked at the venue, rounded (to 100, to 10 under 1,000)."
                                        },
                                        "listed": {
                                            "anyOf": [
                                                {
                                                    "type": "integer",
                                                    "description": "Of them listed for sale, rounded; marketplaces only."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "parked": {
                                            "anyOf": [
                                                {
                                                    "type": "integer",
                                                    "description": "Of them parked only, rounded; marketplaces only."
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "arrivalsWeek": {
                                            "type": "integer",
                                            "description": "Names that arrived over the last seven days."
                                        },
                                        "departuresWeek": {
                                            "type": "integer",
                                            "description": "Names that left over the last seven days."
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "footprintDay": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "listingTerms": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "description": "The verified listing terms: commission bands, exclusivity, payment plans, fast transfer, payout days, the day a person checked them."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_iana_registrars",
        "operationId": "list_iana_registrars",
        "title": "IANA registrar list as stored, by IANA id",
        "description": "The IANA registrar list as stored, by IANA id. Use it when someone asks for accredited registrars beyond the nine compared; it answers one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "enum": [
                        "accredited",
                        "terminated",
                        "reserved"
                    ],
                    "description": "IANA status."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, status, rdapBaseUrl."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "integer",
                                "description": "IANA registrar id."
                            },
                            "name": {
                                "type": "string",
                                "description": "Name as IANA publishes it."
                            },
                            "status": {},
                            "rdapBaseUrl": {
                                "anyOf": [
                                    {
                                        "type": "string",
                                        "description": "RDAP base URL."
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_iana_registrar",
        "operationId": "get_iana_registrar",
        "title": "One IANA registrar by id",
        "description": "One IANA registrar by id. Use it when someone holds an IANA registrar number and asks who it is. Pass `id` (such as 1861).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "IANA registrar id."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, name, status, rdapBaseUrl."
                }
            },
            "required": [
                "id"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "description": "IANA registrar id."
                        },
                        "name": {
                            "type": "string",
                            "description": "Name as IANA publishes it."
                        },
                        "status": {},
                        "rdapBaseUrl": {
                            "anyOf": [
                                {
                                    "type": "string",
                                    "description": "RDAP base URL."
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_market_sales",
        "operationId": "get_market_sales",
        "title": "Domain sales pulse as headline aggregates",
        "description": "The domain sales pulse as headline aggregates: windows, price bands and the sold-before count. Use it when someone asks how the domain sales market is doing overall. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: freshness, pulse, soldBefore."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "freshness": {
                            "type": "object",
                            "properties": {
                                "today": {
                                    "type": "string"
                                },
                                "yesterday": {
                                    "type": "string"
                                },
                                "rollupAt": {
                                    "type": "string"
                                }
                            }
                        },
                        "pulse": {
                            "type": "object",
                            "properties": {
                                "windows": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {
                                                "type": "string"
                                            },
                                            "count": {
                                                "type": "integer"
                                            },
                                            "prevCount": {
                                                "type": "integer"
                                            },
                                            "medianUsd": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            },
                                            "prevMedianUsd": {
                                                "anyOf": [
                                                    {
                                                        "type": "integer"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                "priceBandMix30d": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "band": {
                                                "type": "string"
                                            },
                                            "count": {
                                                "type": "integer"
                                            }
                                        }
                                    }
                                },
                                "priceBandMix12m": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "band": {
                                                "type": "string"
                                            },
                                            "count": {
                                                "type": "integer"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "soldBefore": {
                            "type": "object",
                            "properties": {
                                "size": {
                                    "type": "integer"
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_market_sales_series",
        "operationId": "list_market_sales_series",
        "title": "One sales series by day, week or month, oldest first",
        "description": "One sales series by day, week or month, oldest first. Use it when someone wants sales over time, to chart them or compare periods. Pass `kind` (such as week).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "kind": {
                    "type": "string",
                    "enum": [
                        "day",
                        "week",
                        "month"
                    ],
                    "description": "The period: `day`, `week` (from the Monday) or `month`."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: periodStart, count, meanUsd, medianUsd, comCount, aiCount."
                }
            },
            "required": [
                "kind"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "periodStart": {
                                "type": "string"
                            },
                            "count": {
                                "type": "integer"
                            },
                            "meanUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "medianUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "comCount": {
                                "type": "integer"
                            },
                            "aiCount": {
                                "type": "integer"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_market_sales_endings",
        "operationId": "list_market_sales_endings",
        "title": "Each ending's 12-month and 30-day sales figures",
        "description": "Each ending's 12-month and 30-day sales figures, alphabetical. Use it when someone asks which endings sell and at what median price. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: ending, count12m, median12mUsd, prevCount12m, prevMedian12mUsd, trendWord, count30d, median30dUsd."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ending": {
                                "type": "string"
                            },
                            "count12m": {
                                "type": "integer"
                            },
                            "median12mUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "prevCount12m": {
                                "type": "integer"
                            },
                            "prevMedian12mUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "trendWord": {
                                "type": "string"
                            },
                            "count30d": {
                                "type": "integer"
                            },
                            "median30dUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_market_sales_lengths",
        "operationId": "get_market_sales_lengths",
        "title": "Sales by label length for .com, .ai, .io and .co",
        "description": "Sales by label length for .com, .ai, .io and .co. Use it when someone asks how the length of a name relates to its sale price. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: com, ai, io, co."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "com": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "length": {
                                        "type": "integer"
                                    },
                                    "count12m": {
                                        "type": "integer"
                                    },
                                    "median12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "prevMedian12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "trendWord": {
                                        "type": "string"
                                    },
                                    "count30d": {
                                        "type": "integer"
                                    },
                                    "median30dUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "ai": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "length": {
                                        "type": "integer"
                                    },
                                    "count12m": {
                                        "type": "integer"
                                    },
                                    "median12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "prevMedian12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "trendWord": {
                                        "type": "string"
                                    },
                                    "count30d": {
                                        "type": "integer"
                                    },
                                    "median30dUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "io": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "length": {
                                        "type": "integer"
                                    },
                                    "count12m": {
                                        "type": "integer"
                                    },
                                    "median12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "prevMedian12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "trendWord": {
                                        "type": "string"
                                    },
                                    "count30d": {
                                        "type": "integer"
                                    },
                                    "median30dUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "co": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "length": {
                                        "type": "integer"
                                    },
                                    "count12m": {
                                        "type": "integer"
                                    },
                                    "median12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "prevMedian12mUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "trendWord": {
                                        "type": "string"
                                    },
                                    "count30d": {
                                        "type": "integer"
                                    },
                                    "median30dUsd": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_market_sales_movers",
        "operationId": "list_market_sales_movers",
        "title": "Up to ten words whose sales moved over the last 30 days",
        "description": "Up to ten words whose sales moved over the last 30 days. Use it when someone asks which words are selling more or less lately. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: word, sales30d, prev30d, direction, sales90d, median12mUsd, prevMedian12mUsd, endingsSoldOn."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "word": {
                                "type": "string"
                            },
                            "sales30d": {
                                "type": "integer"
                            },
                            "prev30d": {
                                "type": "integer"
                            },
                            "direction": {
                                "type": "string"
                            },
                            "sales90d": {
                                "type": "integer"
                            },
                            "median12mUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "prevMedian12mUsd": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "endingsSoldOn": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_market_sales_word",
        "operationId": "get_market_sales_word",
        "title": "One word's sales market over 12 months",
        "description": "One word's sales market over 12 months: count, median, endings sold on and the latest sale's month. Use it when someone asks how one word has sold over the last year. Pass `word` (such as hive).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "word": {
                    "type": "string",
                    "description": "The word, 2 to 63 lowercase letters, digits or inner hyphens."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: status, word, sales12m, median12mUsd, endingsSoldOn, lastSaleMonth."
                }
            },
            "required": [
                "word"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string"
                        },
                        "word": {
                            "type": "string"
                        },
                        "sales12m": {
                            "type": "integer"
                        },
                        "median12mUsd": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "endingsSoldOn": {
                            "type": "integer"
                        },
                        "lastSaleMonth": {
                            "description": "`YYYY-MM`.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_market_auctions",
        "operationId": "get_market_auctions",
        "title": "Today's domain auctions by venue",
        "description": "Today's domain auctions by venue, ending and length, the next seven days and the tracked counts. Use it when someone asks about today's auction market as a whole. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: day, closing, withBid, counts, byVenue, byEnding, byLength, next7Days."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "day": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "closing": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "withBid": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "counts": {
                            "type": "object",
                            "properties": {
                                "today": {
                                    "type": "integer"
                                },
                                "results": {
                                    "type": "integer"
                                },
                                "all": {
                                    "type": "integer"
                                }
                            }
                        },
                        "byVenue": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "venue": {
                                        "type": "string",
                                        "description": "Auction venue id (`GET /meta/enums` names each)."
                                    },
                                    "closing": {
                                        "type": "integer"
                                    },
                                    "withBid": {
                                        "type": "integer"
                                    },
                                    "medianBidUsd": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "byEnding": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "ending": {
                                        "type": "string"
                                    },
                                    "closing": {
                                        "type": "integer"
                                    },
                                    "withBid": {
                                        "type": "integer"
                                    },
                                    "medianBidUsd": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "byLength": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "length": {
                                        "type": "integer"
                                    },
                                    "closing": {
                                        "type": "integer"
                                    },
                                    "withBid": {
                                        "type": "integer"
                                    },
                                    "medianBidUsd": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "next7Days": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "day": {
                                        "type": "string"
                                    },
                                    "closing": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_market_auctions_sample",
        "operationId": "list_market_auctions_sample",
        "title": "Day's fixed sample of up to 20 single-word names at auction",
        "description": "The day's fixed sample of up to 20 single-word names at auction, by deadline. Use it when someone wants examples of single-word names at auction today. A fixed daily sample, not every auction. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: name, ending, venue, venueLabel, endsAt, currency, bid, bidCount, verdict, firstYear, tag."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "ending": {
                                "type": "string"
                            },
                            "venue": {
                                "type": "string",
                                "description": "Auction venue id (`GET /meta/enums` names each)."
                            },
                            "venueLabel": {
                                "type": "string"
                            },
                            "endsAt": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "bid": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "bidCount": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "verdict": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "firstYear": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "tag": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_market_auction_venues",
        "operationId": "list_market_auction_venues",
        "title": "Seven auction venues with their verified rules and today's counts",
        "description": "The seven auction venues with their verified rules and today's counts. Use it when someone asks how an auction venue works, or how many auctions it runs today. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, label, currency, kinds, closeRule, paymentRule, bidderRule, firstYear, today."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "description": "Auction venue id (`GET /meta/enums` names each)."
                            },
                            "label": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "kinds": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "closeRule": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "value": {
                                                "type": "string"
                                            },
                                            "verifiedOn": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "paymentRule": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "value": {
                                                "type": "string"
                                            },
                                            "verifiedOn": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "bidderRule": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "value": {
                                                "type": "string"
                                            },
                                            "verifiedOn": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "firstYear": {
                                "type": "object",
                                "additionalProperties": {
                                    "anyOf": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "value": {
                                                    "type": "object",
                                                    "properties": {
                                                        "registrationIncluded": {
                                                            "type": "boolean"
                                                        },
                                                        "flatFee": {
                                                            "type": "number"
                                                        }
                                                    }
                                                },
                                                "verifiedOn": {
                                                    "type": "string"
                                                }
                                            }
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                }
                            },
                            "today": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "closing": {
                                                "type": "integer"
                                            },
                                            "withBid": {
                                                "type": "integer"
                                            },
                                            "medianBidUsd": {
                                                "anyOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "null"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_market_auction_outcomes",
        "operationId": "list_market_auction_outcomes",
        "title": "Confirmed auction outcomes by venue",
        "description": "Confirmed auction outcomes by venue, day and currency, as counts and medians. Use it when someone asks how auctions end at a venue, such as how many sell and at what median. Every input is optional; `limit` sets the page size.",
        "tier": "keyed",
        "plan": "investor",
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "venue": {
                    "type": "string",
                    "enum": [
                        "godaddy",
                        "dynadot",
                        "namesilo",
                        "namecheap",
                        "snapnames",
                        "parkio",
                        "domainlore"
                    ],
                    "description": "One venue only."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: venue, venueLabel, day, currency, count, median."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "venue": {
                                "type": "string",
                                "description": "Auction venue id (`GET /meta/enums` names each)."
                            },
                            "venueLabel": {
                                "type": "string"
                            },
                            "day": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "count": {
                                "type": "integer"
                            },
                            "median": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_trends",
        "operationId": "list_trends",
        "title": "Every published trend with its latest edition figures and its first and last edition day",
        "description": "Every published trend with its latest edition figures and its first and last edition day. Use it when someone looks for rising topics to name a project after; it answers one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "A trend category slug, as the trend categories list names it."
                },
                "lane": {
                    "type": "string",
                    "enum": [
                        "weekly",
                        "yearly"
                    ],
                    "description": "How the trend rises: `weekly` for a topic rising now, `yearly` for one rising over the year."
                },
                "since": {
                    "type": "string",
                    "description": "Trends whose last edition day is on or after this UTC day."
                },
                "sort": {
                    "type": "string",
                    "enum": [
                        "slug",
                        "day"
                    ],
                    "default": "slug",
                    "description": "`slug`, or `day` for the last edition day, newest first."
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name, category, definition, volume, growth, lane, headWord, whyNow, firstEditionOn, lastEditionOn, editionCount."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "slug": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "category": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "definition": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "volume": {
                                "description": "Monthly searches at the latest edition.",
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "growth": {
                                "description": "Signed whole percentage at the latest edition.",
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "lane": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "headWord": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "whyNow": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "firstEditionOn": {
                                "type": "string"
                            },
                            "lastEditionOn": {
                                "type": "string"
                            },
                            "editionCount": {
                                "type": "integer"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_trend",
        "operationId": "get_trend",
        "title": "One trend",
        "description": "One trend: its latest row, its head words, its figures at every edition and its latest observations. Use it when someone asks about one trend: how it grew and its key words. Pass `slug` (such as ambient-lights).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "slug": {
                    "type": "string",
                    "description": "The trend's slug."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name, category, definition, volume, growth, lane, headWord, whyNow, firstEditionOn, lastEditionOn, editionCount, headWords, editions, observations."
                }
            },
            "required": [
                "slug"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "slug": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        },
                        "category": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "definition": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "volume": {
                            "description": "Monthly searches at the latest edition.",
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "growth": {
                            "description": "Signed whole percentage at the latest edition.",
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "lane": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "headWord": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "whyNow": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "firstEditionOn": {
                            "type": "string"
                        },
                        "lastEditionOn": {
                            "type": "string"
                        },
                        "editionCount": {
                            "type": "integer"
                        },
                        "headWords": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "editions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "date": {
                                        "type": "string"
                                    },
                                    "persona": {
                                        "type": "string"
                                    },
                                    "searches": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "growth": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "observations": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "volume": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "growth": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "growthWindow": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "observedAt": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_trend_categories",
        "operationId": "list_trend_categories",
        "title": "Trend categories, to narrow the trends by",
        "description": "The trend categories, to narrow the trends by. Use it when someone wants trends from one field only, such as business or health. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: slug, name."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "slug": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_trend_pool",
        "operationId": "list_trend_pool",
        "title": "Trend candidates the daily editions draw from",
        "description": "The trend candidates the daily editions draw from, with their observations. Use it when someone wants trends before the editions publish them; it answers one page at a time. Every input is optional; `limit` sets the page size.",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "description": "Page size: at most 20 on the free tier, 100 on a paid subscription; a larger value is clamped."
                },
                "cursor": {
                    "type": "string",
                    "description": "The `meta.cursor` of the previous page."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: canonical, definition, headWords, seedWords, openNamesFounder, openNamesInvestor, observations."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "canonical": {
                                "type": "string"
                            },
                            "definition": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "headWords": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "seedWords": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "openNamesFounder": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "openNamesInvestor": {
                                "anyOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "observations": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "volume": {
                                            "anyOf": [
                                                {
                                                    "type": "integer"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "growth": {
                                            "anyOf": [
                                                {
                                                    "type": "integer"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "growthWindow": {
                                            "anyOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "null"
                                                }
                                            ]
                                        },
                                        "observedAt": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_events",
        "operationId": "list_events",
        "title": "Industry events of one month",
        "description": "The industry events of one month, in date order, then the events still without a date. Use it when someone asks about domain or internet industry events in a month. Every input is optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "month": {
                    "type": "string",
                    "description": "`YYYY-MM`, from the month of today minus 30 days to today plus 18 months; the current month by default."
                },
                "category": {
                    "type": "string",
                    "enum": [
                        "domaining",
                        "dns_governance",
                        "brand_ip",
                        "hosting_cloud",
                        "security_privacy",
                        "other_tech"
                    ],
                    "description": "An event category."
                },
                "country": {
                    "type": "string",
                    "description": "ISO 3166-1 alpha-2; filters events only."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, slug, kind, title, startsOn, endsOn, category, countryCode, city, lat, lng."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "slug": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            },
                            "startsOn": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "endsOn": {
                                "description": "Inclusive last day; null for one day.",
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "category": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "countryCode": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "city": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "lat": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "lng": {
                                "anyOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "kind": {
                                "type": "string"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_event",
        "operationId": "get_event",
        "title": "One industry event with its organizer",
        "description": "One industry event with its organizer, location and description. Use it when someone asks for the details of one event. Pass `slug` (such as registrar-day-afnic-2027).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "slug": {
                    "type": "string",
                    "description": "The event's slug, at most 160 characters."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, slug, title, startsOn, endsOn, category, countryCode, city, lat, lng, organizer, location, description."
                }
            },
            "required": [
                "slug"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string"
                        },
                        "slug": {
                            "type": "string"
                        },
                        "title": {
                            "type": "string"
                        },
                        "startsOn": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "endsOn": {
                            "description": "Inclusive last day; null for one day.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "category": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "countryCode": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "city": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "lat": {
                            "anyOf": [
                                {
                                    "type": "number"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "lng": {
                            "anyOf": [
                                {
                                    "type": "number"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "organizer": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "location": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "description": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_agenda",
        "operationId": "get_agenda",
        "title": "Whole public agenda of one month",
        "description": "The whole public agenda of one month: industry events, TLD launch phases and registry changes. Use it when someone asks what happens in a month: events, ending launches and registry changes. Every input is optional.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "month": {
                    "type": "string",
                    "description": "`YYYY-MM`, from the month of today minus 30 days to today plus 18 months; the current month by default."
                },
                "category": {
                    "type": "string",
                    "enum": [
                        "domaining",
                        "dns_governance",
                        "brand_ip",
                        "hosting_cloud",
                        "security_privacy",
                        "other_tech",
                        "launches"
                    ],
                    "description": "An event category, or `launches` for the TLD entries."
                },
                "country": {
                    "type": "string",
                    "description": "ISO 3166-1 alpha-2; filters events only."
                },
                "tld": {
                    "type": "string",
                    "description": "A bare root ending the catalog knows."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: entries, recentlyAdded, undated."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "entries": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "kind": {
                                        "type": "string"
                                    },
                                    "title": {
                                        "type": "string"
                                    },
                                    "startsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "endsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "category": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "countryCode": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "city": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lat": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lng": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "tld": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "recentlyAdded": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "kind": {
                                        "type": "string"
                                    },
                                    "title": {
                                        "type": "string"
                                    },
                                    "startsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "endsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "category": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "countryCode": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "city": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lat": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lng": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "tld": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "undated": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "kind": {
                                        "type": "string"
                                    },
                                    "title": {
                                        "type": "string"
                                    },
                                    "startsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "endsOn": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "category": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "countryCode": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "city": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lat": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lng": {
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "tld": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_latest_edition",
        "operationId": "get_latest_edition",
        "title": "Latest daily edition of Business Ideas or Trending Domains",
        "description": "The latest daily edition of Business Ideas or Trending Domains: trends with open names, for founders or for investors. Use it when someone wants today's name ideas from rising topics; it carries the edition's open names only, and at most 20 trends while `trendCount` counts the whole edition. Pass `persona` (such as founder).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "persona": {
                    "type": "string",
                    "enum": [
                        "founder",
                        "investor"
                    ],
                    "description": "Business Ideas (`founder`) or Trending Domains (`investor`)."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: persona, date, publishAt, trendCount, nameCount, openCount, previousDate, nextDate, trends."
                }
            },
            "required": [
                "persona"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "persona": {
                            "type": "string"
                        },
                        "date": {
                            "type": "string"
                        },
                        "publishAt": {
                            "type": "string"
                        },
                        "trendCount": {
                            "type": "integer",
                            "description": "Trends in the whole edition. `trends` lists at most 20, the ones the public page shows, so this count can be larger."
                        },
                        "nameCount": {
                            "type": "integer",
                            "description": "Names in the whole edition; `openCount` of them are open here."
                        },
                        "openCount": {
                            "type": "integer"
                        },
                        "previousDate": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "nextDate": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "trends": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "slug": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "category": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "definition": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "volume": {
                                        "description": "Searches a month.",
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "growth": {
                                        "description": "Growth, percent.",
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lane": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "headWord": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "whyNow": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "openNames": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lockedCount": {
                                        "type": "integer",
                                        "description": "Names this audience cannot open, a count."
                                    },
                                    "rows": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string"
                                                },
                                                "word": {
                                                    "type": "string"
                                                },
                                                "ending": {
                                                    "type": "string"
                                                },
                                                "matchKind": {
                                                    "type": "string"
                                                },
                                                "relation": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "status": {
                                                    "type": "string"
                                                },
                                                "price": {
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "priceKind": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "quotedBy": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "renewal": {
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "fiveYearCost": {
                                                    "description": "Founder page.",
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "value": {
                                                    "description": "Investor page; null past the public cap on Est. profit.",
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "upsidePercent": {
                                                    "description": "Capped on the public page.",
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "upsideCapped": {
                                                    "type": "boolean"
                                                },
                                                "liquidity": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "verdict": {
                                                    "anyOf": [
                                                        {
                                                            "type": "object",
                                                            "properties": {
                                                                "label": {
                                                                    "type": "string"
                                                                },
                                                                "confidence": {
                                                                    "type": "string"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "rating": {
                                                    "type": "string"
                                                },
                                                "ideas": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "title": {
                                                                "type": "string"
                                                            },
                                                            "idea": {
                                                                "type": "string"
                                                            },
                                                            "problem": {
                                                                "type": "string"
                                                            },
                                                            "customer": {
                                                                "type": "string"
                                                            },
                                                            "valueProp": {
                                                                "type": "string"
                                                            },
                                                            "whyNow": {
                                                                "type": "string"
                                                            },
                                                            "monetization": {
                                                                "type": "string"
                                                            },
                                                            "nameFit": {
                                                                "type": "string"
                                                            },
                                                            "checklist": {
                                                                "type": "array",
                                                                "items": {
                                                                    "type": "string"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_edition",
        "operationId": "get_edition",
        "title": "One dated daily edition of Business Ideas or Trending Domains",
        "description": "One dated daily edition of Business Ideas or Trending Domains: founders read the first, investors the second. Use it when someone asks about a past day's edition. Before 2026-11-10 a day may hold the investors' edition only, which founders read too: the answer then says `investor`. Pass `persona` (such as founder) and `date` (such as 2026-11-10).",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "persona": {
                    "type": "string",
                    "enum": [
                        "founder",
                        "investor"
                    ],
                    "description": "Business Ideas (`founder`) or Trending Domains (`investor`)."
                },
                "date": {
                    "type": "string",
                    "description": "The edition day, UTC."
                },
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: persona, date, publishAt, trendCount, nameCount, openCount, previousDate, nextDate, trends."
                }
            },
            "required": [
                "persona",
                "date"
            ],
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "persona": {
                            "type": "string"
                        },
                        "date": {
                            "type": "string"
                        },
                        "publishAt": {
                            "type": "string"
                        },
                        "trendCount": {
                            "type": "integer",
                            "description": "Trends in the whole edition. `trends` lists at most 20, the ones the public page shows, so this count can be larger."
                        },
                        "nameCount": {
                            "type": "integer",
                            "description": "Names in the whole edition; `openCount` of them are open here."
                        },
                        "openCount": {
                            "type": "integer"
                        },
                        "previousDate": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "nextDate": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "trends": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "slug": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "category": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "definition": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "volume": {
                                        "description": "Searches a month.",
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "growth": {
                                        "description": "Growth, percent.",
                                        "anyOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lane": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "headWord": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "whyNow": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "openNames": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "lockedCount": {
                                        "type": "integer",
                                        "description": "Names this audience cannot open, a count."
                                    },
                                    "rows": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string"
                                                },
                                                "word": {
                                                    "type": "string"
                                                },
                                                "ending": {
                                                    "type": "string"
                                                },
                                                "matchKind": {
                                                    "type": "string"
                                                },
                                                "relation": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "status": {
                                                    "type": "string"
                                                },
                                                "price": {
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "priceKind": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "quotedBy": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "renewal": {
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "fiveYearCost": {
                                                    "description": "Founder page.",
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "value": {
                                                    "description": "Investor page; null past the public cap on Est. profit.",
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "upsidePercent": {
                                                    "description": "Capped on the public page.",
                                                    "anyOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "upsideCapped": {
                                                    "type": "boolean"
                                                },
                                                "liquidity": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "verdict": {
                                                    "anyOf": [
                                                        {
                                                            "type": "object",
                                                            "properties": {
                                                                "label": {
                                                                    "type": "string"
                                                                },
                                                                "confidence": {
                                                                    "type": "string"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "rating": {
                                                    "type": "string"
                                                },
                                                "ideas": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "title": {
                                                                "type": "string"
                                                            },
                                                            "idea": {
                                                                "type": "string"
                                                            },
                                                            "problem": {
                                                                "type": "string"
                                                            },
                                                            "customer": {
                                                                "type": "string"
                                                            },
                                                            "valueProp": {
                                                                "type": "string"
                                                            },
                                                            "whyNow": {
                                                                "type": "string"
                                                            },
                                                            "monetization": {
                                                                "type": "string"
                                                            },
                                                            "nameFit": {
                                                                "type": "string"
                                                            },
                                                            "checklist": {
                                                                "type": "array",
                                                                "items": {
                                                                    "type": "string"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_meta_enums",
        "operationId": "get_meta_enums",
        "title": "Every list of values the answers use",
        "description": "Every list of values the answers use, such as statuses, venues and bands. Use it when an answer holds a code and someone needs its meaning. An auction answer names its own venue on each row, which may be one this list leaves out. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: statuses, lifecycles, eppStatuses, lookupStates, wordShapes, wordOrigins, tldKinds, agendaCategories, eventCategories, editionLanes, changeEventTypes, changeEventSubjects, auctionVenues, parkingServices."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "statuses": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "lifecycles": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "eppStatuses": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "lookupStates": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "wordShapes": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "wordOrigins": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "tldKinds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "agendaCategories": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "eventCategories": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "editionLanes": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "changeEventTypes": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "changeEventSubjects": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "auctionVenues": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "label": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "parkingServices": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "label": {
                                        "type": "string"
                                    },
                                    "kind": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_meta_freshness",
        "operationId": "get_meta_freshness",
        "title": "How current each part of the stored data is",
        "description": "How current each part of the stored data is, with the day's counts. Use it when someone asks how fresh the stored data is. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: asOf, scannedToday, checkedLast24h, lanes."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "scannedToday": {
                            "type": "integer"
                        },
                        "checkedLast24h": {
                            "type": "integer"
                        },
                        "lanes": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "lane": {
                                        "type": "string"
                                    },
                                    "scanned": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "state": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_meta_datasets",
        "operationId": "list_meta_datasets",
        "title": "Free GitHub datasets that hold the same rows as these answers",
        "description": "The free GitHub datasets that hold the same rows as these answers. Use it when someone wants the data in bulk, as files. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: id, repository, url, endpoint, updatedOn."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "repository": {
                                "type": "string"
                            },
                            "url": {
                                "type": "string"
                            },
                            "endpoint": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "updatedOn": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_list_meta_trademark_classes",
        "operationId": "list_meta_trademark_classes",
        "title": "45 Nice classes a trademark is filed under",
        "description": "The 45 Nice classes a trademark is filed under. Use it when a trademark answer names a class number and someone needs what it covers. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: class, title, kind."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "class": {
                                "type": "integer"
                            },
                            "title": {
                                "type": "string"
                            },
                            "kind": {
                                "type": "string"
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_meta_providers",
        "operationId": "get_meta_providers",
        "title": "Registrar identities and the auction venue and parking service catalogs",
        "description": "Registrar identities and the auction venue and parking service catalogs. Use it when someone needs the registrars, auction venues and parking services an answer may name. An auction answer names its own venue on each row, which may be one this list leaves out. Takes no input.",
        "tier": "free",
        "plan": null,
        "metered": null,
        "hosted": true,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: registrars, auctionVenues, parkingServices."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "registrars": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "slug": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "ianaId": {
                                        "anyOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    },
                                    "homepageUrl": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "auctionVenues": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "label": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "parkingServices": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    },
                                    "label": {
                                        "type": "string"
                                    },
                                    "kind": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    },
    {
        "name": "ud_get_key",
        "operationId": "get_key",
        "title": "What the calling member key opens",
        "description": "What the calling member key opens: its allowances and its month. Use it when someone asks how many calls or checks are left this month. Takes no input.",
        "tier": "keyed",
        "plan": null,
        "metered": null,
        "hosted": false,
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "string",
                    "description": "Comma-separated top-level keys to keep: access, plan, keyPrefix, listing, subscription, month, resetsOn, calls, liveChecks, appraisals, intakes, investorEndpoints."
                }
            },
            "additionalProperties": false
        },
        "keyedParameters": [],
        "outputSchema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "access": {
                            "type": "string"
                        },
                        "plan": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "keyPrefix": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "listing": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "subscription": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "month": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "resetsOn": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "calls": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "used": {
                                            "type": "integer"
                                        },
                                        "allowance": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "liveChecks": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "used": {
                                            "type": "integer"
                                        },
                                        "allowance": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "appraisals": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "used": {
                                            "type": "integer"
                                        },
                                        "allowance": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "intakes": {
                            "anyOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "used": {
                                            "type": "integer"
                                        },
                                        "allowance": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "investorEndpoints": {
                            "anyOf": [
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                },
                "meta": {
                    "type": "object",
                    "properties": {
                        "asOf": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "cursor": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "limit": {
                            "anyOf": [
                                {
                                    "type": "integer"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "additionalProperties": true,
                    "description": "The day of the answer, and the page cursor of a list."
                },
                "links": {
                    "type": "object",
                    "description": "Links of the answer.",
                    "properties": {
                        "self": {
                            "type": "string",
                            "description": "This answer on the API."
                        },
                        "next": {
                            "description": "The next page on the API, when there is one.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "register": {
                            "description": "Where to register the name, when it can be registered.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "product": {
                            "description": "The Unique Domains page that opens what a refusal named.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "dataset": {
                            "description": "The GitHub dataset holding the same rows.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "details": {
                            "description": "The public Unique Domains page about the subject.",
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "annotations": {
            "readOnlyHint": true,
            "destructiveHint": false,
            "idempotentHint": true,
            "openWorldHint": false
        },
        "justification": {
            "readOnly": "Read-only: it reads stored Unique Domains data and changes nothing.",
            "openWorld": "Closed world: it reads the Unique Domains catalog only, never the open web.",
            "destructive": "Not destructive: it writes and deletes nothing."
        }
    }
];
