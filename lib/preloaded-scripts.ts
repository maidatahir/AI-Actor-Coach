export interface ScriptScene {
  number: number
  title: string
  emotion: string
  duration: string
  description: string
  lines?: string[]
}

export interface PreloadedScript {
  id: string
  title: string
  author: string
  scenes: number
  genre: string
  difficulty: string
  description?: string
  sceneData?: ScriptScene[]
}

export const preloadedScripts: PreloadedScript[] = [
  {
    id: "1",
    title: "Hamlet",
    author: "William Shakespeare",
    scenes: 5,
    genre: "Tragedy",
    difficulty: "Advanced",
    description: "The Tragedy of Hamlet, Prince of Denmark, is a tragedy written by William Shakespeare. Set in Denmark, the play depicts Prince Hamlet and his revenge against his uncle, Claudius.",
    sceneData: [
      { number: 1, title: "The Ghost Appears", emotion: "Fear, Curiosity", duration: "5 min", description: "Hamlet encounters the ghost of his father on the castle battlements.", lines: ["Who's there?", "Nay, answer me: stand, and unfold yourself.", "Long live the king!", "You come most carefully upon your hour."] },
      { number: 2, title: "To Be or Not To Be", emotion: "Melancholy, Contemplation", duration: "6 min", description: "Hamlet's famous soliloquy on the nature of existence.", lines: ["To be, or not to be, that is the question:", "Whether 'tis nobler in the mind to suffer", "The slings and arrows of outrageous fortune,", "Or to take Arms against a Sea of troubles,", "And by opposing end them: to die, to sleep", "No more; and by a sleep, to say we end", "The heart-ache, and the thousand natural shocks", "That Flesh is heir to? 'Tis a consummation"] },
      { number: 3, title: "The Play Within a Play", emotion: "Cunning, Anxiety", duration: "8 min", description: "Hamlet uses a theatrical performance to expose his uncle's guilt.", lines: ["Speak the speech, I pray you, as I pronounced it to you,", "trippingly on the tongue.", "But if you mouth it, as many of your players do,", "I had as lief the town-crier spoke my lines."] },
      { number: 4, title: "Confronting Gertrude", emotion: "Anger, Disappointment", duration: "7 min", description: "Hamlet confronts his mother about her hasty remarriage.", lines: ["Now, mother, what's the matter?", "Hamlet, thou hast thy father much offended.", "Mother, you have my father much offended.", "Come, come, you answer with an idle tongue."] },
      { number: 5, title: "The Final Duel", emotion: "Determination, Tragedy", duration: "10 min", description: "The climactic sword fight between Hamlet and Laertes.", lines: ["Come, Hamlet, come, and take this hand from me.", "Give me your pardon, sir: I've done you wrong;", "But pardon't, as you are a gentleman.", "I am satisfied in nature."] },
    ],
  },
  {
    id: "2",
    title: "Romeo and Juliet",
    author: "William Shakespeare",
    scenes: 6,
    genre: "Romance",
    difficulty: "Intermediate",
    description: "A tragic love story of two young lovers whose deaths ultimately reconcile their feuding families.",
    sceneData: [
      { number: 1, title: "The Balcony Scene", emotion: "Love, Longing", duration: "8 min", description: "Romeo declares his love for Juliet beneath her balcony.", lines: ["But, soft! what light through yonder window breaks?", "It is the east, and Juliet is the sun.", "Arise, fair sun, and kill the envious moon,", "Who is already sick and pale with grief."] },
      { number: 2, title: "The Secret Marriage", emotion: "Joy, Hope", duration: "5 min", description: "Romeo and Juliet are secretly married by Friar Laurence.", lines: ["These violent delights have violent ends,", "And in their triumph die, like fire and powder,", "Which as they kiss consume."] },
      { number: 3, title: "Tybalt's Challenge", emotion: "Anger, Conflict", duration: "6 min", description: "Tybalt challenges Romeo, leading to a fatal confrontation.", lines: ["Romeo, the hate I bear thee can afford", "No better term than this: thou art a villain.", "Tybalt, the reason that I have to love thee", "Doth much excuse the appertaining rage."] },
      { number: 4, title: "The Banishment", emotion: "Despair, Grief", duration: "7 min", description: "Romeo is banished from Verona for killing Tybalt.", lines: ["Ha, banishment! Be merciful, say 'death';", "For exile hath more terror in his look,", "Much more than death: do not say 'banishment'."] },
      { number: 5, title: "Juliet's Potion", emotion: "Fear, Desperation", duration: "5 min", description: "Juliet takes the sleeping potion to fake her death.", lines: ["Farewell! God knows when we shall meet again.", "I have a faint cold fear thrills through my veins,", "That almost freezes up the heat of life."] },
      { number: 6, title: "The Tomb", emotion: "Tragedy, Grief", duration: "10 min", description: "Romeo and Juliet both meet their tragic fate in the Capulet tomb.", lines: ["Eyes, look your last!", "Arms, take your last embrace!", "And, lips, O you the doors of breath,", "Seal with a righteous kiss a dateless bargain to engrossing death!"] },
    ],
  },
  {
    id: "3",
    title: "A Streetcar Named Desire",
    author: "Tennessee Williams",
    scenes: 4,
    genre: "Drama",
    difficulty: "Advanced",
    description: "The story of Blanche DuBois, a fading Southern belle, who moves in with her sister Stella and her husband Stanley in New Orleans.",
    sceneData: [
      { number: 1, title: "Blanche's Arrival", emotion: "Anxiety, Pretense", duration: "6 min", description: "Blanche arrives at her sister's apartment in the French Quarter.", lines: ["They told me to take a street-car named Desire,", "and then transfer to one called Cemeteries,", "and ride six blocks and get off at—Elysian Fields!"] },
      { number: 2, title: "The Poker Night", emotion: "Tension, Desire", duration: "8 min", description: "Stanley's poker game drives escalating tension between the characters.", lines: ["Whoever you are—I have always depended on the kindness of strangers."] },
      { number: 3, title: "Blanche's Confession", emotion: "Vulnerability, Shame", duration: "7 min", description: "Blanche reveals her troubled past to Mitch.", lines: ["I don't want realism. I want magic!", "Yes, yes, magic! I try to give that to people.", "I misrepresent things to them. I don't tell truth, I tell what ought to be truth."] },
      { number: 4, title: "The Final Confrontation", emotion: "Fear, Desperation", duration: "9 min", description: "The devastating confrontation between Blanche and Stanley.", lines: ["I have always depended on the kindness of strangers."] },
    ],
  },
  {
    id: "4",
    title: "Death of a Salesman",
    author: "Arthur Miller",
    scenes: 3,
    genre: "Drama",
    difficulty: "Intermediate",
    description: "The story of aging salesman Willy Loman as he confronts the gap between his dreams and his reality.",
    sceneData: [
      { number: 1, title: "Willy's Return", emotion: "Exhaustion, Confusion", duration: "7 min", description: "Willy returns home after a failed sales trip.", lines: ["I'm tired to the death.", "I couldn't make it. I just couldn't make it, Linda."] },
      { number: 2, title: "The Restaurant Scene", emotion: "Humiliation, Disappointment", duration: "8 min", description: "Willy's lunch with his sons reveals bitter truths.", lines: ["A man is not a bird, to come and go with the springtime.", "He's got to add up to something."] },
      { number: 3, title: "Requiem", emotion: "Grief, Reflection", duration: "6 min", description: "The family gathers after Willy's death.", lines: ["Attention, attention must be finally paid to such a person.", "He's not to be allowed to fall into his grave like an old dog."] },
    ],
  },
  {
    id: "5",
    title: "The Glass Menagerie",
    author: "Tennessee Williams",
    scenes: 7,
    genre: "Drama",
    difficulty: "Beginner",
    description: "A memory play by Tennessee Williams, narrated by Tom Wingfield, about his mother Amanda and his sister Laura.",
    sceneData: [
      { number: 1, title: "Tom's Introduction", emotion: "Nostalgia, Melancholy", duration: "4 min", description: "Tom introduces the play as a memory.", lines: ["Yes, I have tricks in my pocket, I have things up my sleeve.", "But I am the opposite of a stage magician.", "He gives you illusion that has the appearance of truth.", "I give you truth in the pleasant disguise of illusion."] },
      { number: 2, title: "The Dinner Scene", emotion: "Tension, Frustration", duration: "5 min", description: "Amanda pressures Tom during dinner.", lines: ["Honey, don't push with your fingers.", "You're not excused from the table."] },
      { number: 3, title: "Laura's Glass Collection", emotion: "Gentleness, Isolation", duration: "4 min", description: "Laura tends to her glass figurines.", lines: ["Little articles of glass, they're ornaments mostly!", "Most of them are little animals made out of glass."] },
      { number: 4, title: "Amanda's Memories", emotion: "Nostalgia, Longing", duration: "5 min", description: "Amanda recalls her days as a Southern belle.", lines: ["One Sunday afternoon in Blue Mountain—your mother received—seventeen!—gentlemen callers!"] },
      { number: 5, title: "Tom at the Movies", emotion: "Restlessness, Escapism", duration: "3 min", description: "Tom seeks escape at the movies.", lines: ["I go to the movies because—I like adventure."] },
      { number: 6, title: "The Gentleman Caller", emotion: "Hope, Anxiety", duration: "6 min", description: "Jim O'Connor visits, bringing hope to the family.", lines: ["You know what I judge to be the trouble with you?", "Inferiority complex!"] },
      { number: 7, title: "The Unicorn Breaks", emotion: "Heartbreak, Acceptance", duration: "5 min", description: "Jim accidentally breaks Laura's glass unicorn.", lines: ["Now it is just like all the other horses.", "It's lost its horn. It doesn't seem so freakish now."] },
    ],
  },
  {
    id: "6",
    title: "Macbeth",
    author: "William Shakespeare",
    scenes: 5,
    genre: "Tragedy",
    difficulty: "Advanced",
    description: "A Scottish general receives a prophecy that he will become King of Scotland, leading to corruption and madness.",
    sceneData: [
      { number: 1, title: "The Witches' Prophecy", emotion: "Mystery, Ambition", duration: "5 min", description: "Macbeth encounters the three witches.", lines: ["All hail, Macbeth! Hail to thee, thane of Glamis!", "All hail, Macbeth! Hail to thee, thane of Cawdor!", "All hail, Macbeth, that shalt be king hereafter!"] },
      { number: 2, title: "Lady Macbeth's Soliloquy", emotion: "Ambition, Ruthlessness", duration: "6 min", description: "Lady Macbeth steels herself for the murder.", lines: ["Come, you spirits", "That tend on mortal thoughts, unsex me here,", "And fill me from the crown to the toe top-full", "Of direst cruelty!"] },
      { number: 3, title: "The Dagger Speech", emotion: "Guilt, Hallucination", duration: "5 min", description: "Macbeth hallucinates a dagger before the murder.", lines: ["Is this a dagger which I see before me,", "The handle toward my hand?", "Come, let me clutch thee.", "I have thee not, and yet I see thee still."] },
      { number: 4, title: "Out, Damned Spot", emotion: "Madness, Guilt", duration: "4 min", description: "Lady Macbeth's sleepwalking scene.", lines: ["Out, damned spot! out, I say!", "One: two: why, then, 'tis time to do't.", "Hell is murky!"] },
      { number: 5, title: "Tomorrow and Tomorrow", emotion: "Despair, Nihilism", duration: "5 min", description: "Macbeth reflects on the futility of life.", lines: ["Tomorrow, and tomorrow, and tomorrow,", "Creeps in this petty pace from day to day,", "To the last syllable of recorded time."] },
    ],
  },
  {
    id: "7",
    title: "A Raisin in the Sun",
    author: "Lorraine Hansberry",
    scenes: 3,
    genre: "Drama",
    difficulty: "Intermediate",
    description: "The story of a Black family on the South Side of Chicago as they struggle to improve their lives.",
    sceneData: [
      { number: 1, title: "The Insurance Check", emotion: "Hope, Tension", duration: "7 min", description: "The family debates how to use the insurance money.", lines: ["What's the matter with you all!", "I just want so many things..."] },
      { number: 2, title: "Walter's Dream", emotion: "Ambition, Frustration", duration: "6 min", description: "Walter shares his vision for the liquor store.", lines: ["Sometimes it's like I can see the future stretched out in front of me—just plain as day."] },
      { number: 3, title: "Mama's Plant", emotion: "Resilience, Pride", duration: "5 min", description: "Mama decides to use the money for a house.", lines: ["Well—son, I'm waiting to hear you say something...", "I'm waiting to hear how you be your father's son."] },
    ],
  },
  {
    id: "8",
    title: "The Crucible",
    author: "Arthur Miller",
    scenes: 4,
    genre: "Drama",
    difficulty: "Intermediate",
    description: "A dramatized story of the Salem witch trials, exploring mass hysteria and individual integrity.",
    sceneData: [
      { number: 1, title: "The Accusations Begin", emotion: "Fear, Paranoia", duration: "6 min", description: "The girls begin their accusations of witchcraft.", lines: ["I want the light of God, I want the sweet love of Jesus!", "I danced for the Devil; I saw him, I wrote in his book."] },
      { number: 2, title: "John Proctor's Dilemma", emotion: "Guilt, Integrity", duration: "7 min", description: "Proctor wrestles with his past affair and present conscience.", lines: ["Because it is my name! Because I cannot have another in my life!", "Because I lie and sign myself to lies!"] },
      { number: 3, title: "The Court Scene", emotion: "Desperation, Injustice", duration: "8 min", description: "Proctor and Mary Warren challenge the court.", lines: ["A man may think God sleeps, but God sees everything, I know it now."] },
      { number: 4, title: "Proctor's Choice", emotion: "Sacrifice, Dignity", duration: "6 min", description: "Proctor makes his final choice.", lines: ["I have given you my soul; leave me my name!", "How may I live without my name?"] },
    ],
  },
]
