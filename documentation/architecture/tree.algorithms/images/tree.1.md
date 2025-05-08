z.array(z.array(z.string().nullable())).optional()
                                    |
                                    |
                  z.array(z.array(z.string().nullable())).optional
                   ____________________|__________________
                  |                                       |
     z.array(z.array(z.string().nullable()))           optional
                        |
             ___________|________________
            |                            |
        z.array          z.array(z.string().nullable())
            |                    ________|_______
     _______|______             |                |
    |              |         z.array         z.string().nullable()
    z            array       ___|___                   |
                            |       |                  |
                            z     array        z.string().nullable
                                                   ____|_____
                                                  |          |
                                             z.string()   nullable
                                                |
                                                |
                                             z.string
                                                |
                                           _____|_____
                                          |           |
                                          z         string




















































