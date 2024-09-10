import { z } from "zod";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  variant: z.string(),
  kind: z.number(),
  flags: z.object({}),
  children: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      variant: z.string(),
      kind: z.number(),
      flags: z.object({}),
      comment: z.object({
        summary: z.array(z.object({ kind: z.string(), text: z.string() })),
      }),
      children: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          variant: z.string(),
          kind: z.number(),
          flags: z.object({}),
          comment: z.object({
            summary: z.array(
              z.union([
                z.object({ kind: z.string(), text: z.string() }),
                z.object({
                  kind: z.string(),
                  tag: z.string(),
                  text: z.string(),
                }),
              ])
            ),
          }),
          children: z.array(
            z.union([
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({}),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.object({ kind: z.string(), text: z.string() })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    parameters: z.array(
                      z.union([
                        z.object({
                          id: z.number(),
                          name: z.string(),
                          variant: z.string(),
                          kind: z.number(),
                          flags: z.object({}),
                          comment: z.object({
                            summary: z.array(
                              z.object({ kind: z.string(), text: z.string() })
                            ),
                          }),
                          type: z.object({
                            type: z.string(),
                            name: z.string(),
                          }),
                        }),
                        z.object({
                          id: z.number(),
                          name: z.string(),
                          variant: z.string(),
                          kind: z.number(),
                          flags: z.object({ isOptional: z.boolean() }),
                          comment: z.object({
                            summary: z.array(
                              z.object({ kind: z.string(), text: z.string() })
                            ),
                          }),
                          type: z.object({
                            type: z.string(),
                            name: z.string(),
                          }),
                        }),
                      ])
                    ),
                    type: z.object({
                      type: z.string(),
                      target: z.number(),
                      name: z.string(),
                      package: z.string(),
                    }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                comment: z.object({
                  summary: z.array(
                    z.object({ kind: z.string(), text: z.string() })
                  ),
                }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({ type: z.string(), name: z.string() }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                comment: z.object({
                  summary: z.array(
                    z.union([
                      z.object({ kind: z.string(), text: z.string() }),
                      z.object({
                        kind: z.string(),
                        tag: z.string(),
                        text: z.string(),
                      }),
                    ])
                  ),
                }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({ type: z.string(), name: z.string() }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                comment: z.object({
                  summary: z.array(
                    z.object({ kind: z.string(), text: z.string() })
                  ),
                }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({
                  type: z.string(),
                  target: z.object({
                    sourceFileName: z.string(),
                    qualifiedName: z.string(),
                  }),
                  name: z.string(),
                  package: z.string(),
                }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({ type: z.string(), name: z.string() }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                comment: z.object({
                  summary: z.array(
                    z.union([
                      z.object({ kind: z.string(), text: z.string() }),
                      z.object({
                        kind: z.string(),
                        tag: z.string(),
                        text: z.string(),
                      }),
                    ])
                  ),
                }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({
                  type: z.string(),
                  target: z.object({
                    sourceFileName: z.string(),
                    qualifiedName: z.string(),
                  }),
                  name: z.string(),
                  package: z.string(),
                }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isProtected: z.boolean() }),
                comment: z.object({
                  summary: z.array(
                    z.object({ kind: z.string(), text: z.string() })
                  ),
                }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({ type: z.string(), name: z.string() }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                comment: z.object({
                  summary: z.array(
                    z.object({ kind: z.string(), text: z.string() })
                  ),
                }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                type: z.object({
                  type: z.string(),
                  target: z.object({
                    sourceFileName: z.string(),
                    qualifiedName: z.string(),
                  }),
                  typeArguments: z.array(
                    z.object({
                      type: z.string(),
                      target: z.object({
                        sourceFileName: z.string(),
                        qualifiedName: z.string(),
                      }),
                      name: z.string(),
                      package: z.string(),
                    })
                  ),
                  name: z.string(),
                  package: z.string(),
                }),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPublic: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.object({ kind: z.string(), text: z.string() })
                      ),
                      blockTags: z.array(
                        z.object({
                          tag: z.string(),
                          content: z.array(
                            z.object({ kind: z.string(), text: z.string() })
                          ),
                        })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    type: z.object({
                      type: z.string(),
                      target: z.object({
                        sourceFileName: z.string(),
                        qualifiedName: z.string(),
                      }),
                      name: z.string(),
                      package: z.string(),
                    }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPublic: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPublic: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.union([
                          z.object({ kind: z.string(), text: z.string() }),
                          z.object({
                            kind: z.string(),
                            tag: z.string(),
                            text: z.string(),
                          }),
                        ])
                      ),
                      blockTags: z.array(
                        z.object({
                          tag: z.string(),
                          content: z.array(
                            z.object({ kind: z.string(), text: z.string() })
                          ),
                        })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.object({ kind: z.string(), text: z.string() })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    parameters: z.array(
                      z.object({
                        id: z.number(),
                        name: z.string(),
                        variant: z.string(),
                        kind: z.number(),
                        flags: z.object({}),
                        comment: z.object({
                          summary: z.array(
                            z.object({ kind: z.string(), text: z.string() })
                          ),
                        }),
                        type: z.object({ type: z.string(), name: z.string() }),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(z.unknown()),
                      blockTags: z.array(
                        z.object({
                          tag: z.string(),
                          content: z.array(z.unknown()),
                        })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    parameters: z.array(
                      z.object({
                        id: z.number(),
                        name: z.string(),
                        variant: z.string(),
                        kind: z.number(),
                        flags: z.object({}),
                        comment: z.object({
                          summary: z.array(
                            z.object({ kind: z.string(), text: z.string() })
                          ),
                        }),
                        type: z.object({ type: z.string(), name: z.string() }),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPublic: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.object({ kind: z.string(), text: z.string() })
                      ),
                      blockTags: z.array(
                        z.object({
                          tag: z.string(),
                          content: z.array(
                            z.object({ kind: z.string(), text: z.string() })
                          ),
                        })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    parameters: z.array(
                      z.object({
                        id: z.number(),
                        name: z.string(),
                        variant: z.string(),
                        kind: z.number(),
                        flags: z.object({}),
                        type: z.object({
                          type: z.string(),
                          target: z.object({
                            sourceFileName: z.string(),
                            qualifiedName: z.string(),
                          }),
                          name: z.string(),
                          package: z.string(),
                        }),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPublic: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.object({ kind: z.string(), text: z.string() })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    parameters: z.array(
                      z.object({
                        id: z.number(),
                        name: z.string(),
                        variant: z.string(),
                        kind: z.number(),
                        flags: z.object({}),
                        type: z.object({ type: z.string(), name: z.string() }),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                variant: z.string(),
                kind: z.number(),
                flags: z.object({ isPrivate: z.boolean() }),
                sources: z.array(
                  z.object({
                    fileName: z.string(),
                    line: z.number(),
                    character: z.number(),
                  })
                ),
                signatures: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    variant: z.string(),
                    kind: z.number(),
                    flags: z.object({}),
                    comment: z.object({
                      summary: z.array(
                        z.object({ kind: z.string(), text: z.string() })
                      ),
                      blockTags: z.array(
                        z.object({
                          tag: z.string(),
                          content: z.array(
                            z.object({ kind: z.string(), text: z.string() })
                          ),
                        })
                      ),
                    }),
                    sources: z.array(
                      z.object({
                        fileName: z.string(),
                        line: z.number(),
                        character: z.number(),
                      })
                    ),
                    type: z.object({ type: z.string(), name: z.string() }),
                  })
                ),
              }),
            ])
          ),
          groups: z.array(
            z.object({ title: z.string(), children: z.array(z.number()) })
          ),
          sources: z.array(
            z.object({
              fileName: z.string(),
              line: z.number(),
              character: z.number(),
            })
          ),
        })
      ),
      groups: z.array(
        z.object({ title: z.string(), children: z.array(z.number()) })
      ),
      sources: z.array(
        z.object({
          fileName: z.string(),
          line: z.number(),
          character: z.number(),
        })
      ),
    })
  ),
  groups: z.array(
    z.object({ title: z.string(), children: z.array(z.number()) })
  ),
  packageName: z.string(),
  readme: z.array(z.object({ kind: z.string(), text: z.string() })),
  symbolIdMap: z.object({
    0: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    1: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    2: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    3: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    4: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    5: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    6: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    7: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    8: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    9: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    10: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    11: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    12: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    13: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    14: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    15: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    16: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    17: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    18: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    19: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    20: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    21: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    22: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    23: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    24: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    25: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    26: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    27: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    28: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    29: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    30: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    31: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    32: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    33: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    34: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    35: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    36: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    37: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    38: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    39: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    40: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
    41: z.object({ sourceFileName: z.string(), qualifiedName: z.string() }),
  }),
});
