z.array(z.array(z.string().nullable())).optional()
                                    |
                 ___________________|______________________________________
                |                                                          |
z.array(z.array(z.string().nullable())).optional                         empty
                   ________|______________________________
                  |                                       |
     z.array(z.array(z.string().nullable()))           optional
                        |
             ___________|______________
            |                          |
        z.array          z.array(z.string().nullable())
            |                    ________|_______
     _______|______             |                |
    |              |         z.array         z.string().nullable()
    z            array       ___|___          __________|_________
                            |       |        |                    |
                            z     array  z.string().nullable     empty
                                             ____|_____
                                            |          |
                                         z.string()   nullable
                                       ______|______
                                      |             |
                                   z.string       empty
                                      |
                                 _____|_____
                                |           |
                                z         string




















































