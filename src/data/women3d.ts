export interface Woman {
  readonly name: string
  readonly year: number
  readonly fields: string
  readonly shortSummary: string
  readonly summary: string
  readonly url: string
  readonly backlinks: number
  readonly birthYear: number | null
  readonly references: number
  readonly position: Readonly<{ x: number; y: number; z: number }>
}

const women = [
  {
    name: "Adele Goldstine",
    year: 1944,
    fields: "Mathmatician, computer programmer",
    shortSummary: "Wrote the manual for the first electronic digital computer, ENIAC.",
    summary: "Adele Goldstine (née Katz; December 21, 1920 – November, 1964) was an American mathematician and computer programmer. She wrote the manual for the first electronic digital computer, ENIAC. Through her work programming the computer, she was also an instrumental player in converting the ENIAC from a computer that needed to be reprogrammed each time it was used to one that was able to perform a set of fifty stored instructions.",
    url: "https://en.wikipedia.org/wiki/Adele_Goldstine",
    backlinks: 246,
    birthYear: 1920,
    references: 1,
    position: { x: -22, y: 15, z: -8 }
  },
  {
    name: "Barbara Paulson",
    year: 1948,
    fields: "Human computer",
    shortSummary: "One of the first women scientists at NASA's JPL, calculated rocket trajectories by hand.",
    summary: "Barbara Jean Paulson (née Lewis, born April 11, 1928) is an American former human computer at NASA's Jet Propulsion Laboratory (JPL) and one of the first women scientists employed there. Paulson began working as a mathematician at JPL in 1948, where she calculated rocket trajectories by hand. She is among the women who made early progress at JPL.",
    url: "https://en.wikipedia.org/wiki/Barbara_Paulson",
    backlinks: 17,
    birthYear: 1928,
    references: 11,
    position: { x: -18, y: 5, z: 12 }
  },
  {
    name: "Kathleen Booth",
    year: 1949,
    fields: "Computer scientist",
    shortSummary: "Invented the first assembly language.",
    summary: "Kathleen Booth (born 1922) wrote the first assembly language and designed the assembler and autocode for the first computer systems at Birkbeck College, University of London. She helped design three different machines including the ARC (Automatic Relay Calculator), SEC (Simple Electronic Computer), and APE(X)C.",
    url: "https://en.wikipedia.org/wiki/Kathleen_Booth",
    backlinks: 39,
    birthYear: 1922,
    references: 12,
    position: { x: -15, y: 7, z: -12 }
  },
  {
    name: "Grace Hopper",
    year: 1949,
    fields: "Computer scientist, United States Navy rear admiral",
    shortSummary: "First person to design a compiler for a programming language.",
    summary: "Grace Brewster Murray Hopper (née Murray December 9, 1906 – January 1, 1992) was an American computer scientist and United States Navy rear admiral. One of the first programmers of the Harvard Mark I computer, she was a pioneer of computer programming who invented one of the first linkers. She popularized the idea of machine-independent programming languages, which led to the development of COBOL, an early high-level programming language still in use today.",
    url: "https://en.wikipedia.org/wiki/Grace_Hopper",
    backlinks: 1257,
    birthYear: 1906,
    references: 91,
    position: { x: -12, y: 22, z: 5 }
  },
  {
    name: "Katherine Johnson",
    year: 1958,
    fields: "Mathematician",
    shortSummary: "Calculated trajectories, launch windows and emergency return paths critical to the success of the first and subsequent U.S. crewed spaceflights.",
    summary: "Katherine Coleman Goble Johnson (born August 26, 1918) is an American mathematician whose calculations of orbital mechanics as a NASA employee were critical to the success of the first and subsequent U.S. crewed spaceflights. During her 35-year career at NASA and its predecessor, she earned a reputation for mastering complex manual calculations and helped pioneer the use of computers to perform the tasks.",
    url: "https://en.wikipedia.org/wiki/Katherine_Johnson",
    backlinks: 484,
    birthYear: 1918,
    references: 67,
    position: { x: -5, y: 18, z: -3 }
  },
  {
    name: "Margaret Hamilton",
    year: 1965,
    fields: "Computer scientist, systems engineer, business owner",
    shortSummary: "Programmed the onboard flight software for NASA's Apollo Moon mission computers.",
    summary: "Margaret Heafield Hamilton (born August 17, 1936) is an American computer scientist, systems engineer and business owner. She was director of the Software Engineering Division of the MIT Instrumentation Laboratory, which developed on-board flight software for NASA's Apollo space program. She later founded two software companies. Hamilton has published more than 130 papers, proceedings and reports about sixty projects and six major programs. She is one of the people credited with coining the term 'software engineering'.",
    url: "https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)",
    backlinks: 104,
    birthYear: 1936,
    references: 81,
    position: { x: 2, y: 12, z: 10 }
  },
  {
    name: "Erna Schneider Hoover",
    year: 1971,
    fields: "Mathematician",
    shortSummary: "Invented a computerized telephone switching method that replaced switchboards and \"revolutionized modern communication\".",
    summary: "Dr. Erna Schneider Hoover (born June 19, 1926) is an American mathematician notable for inventing a computerized telephone switching method which 'revolutionized modern communication' according to several reports. It prevented system overloads by monitoring call center traffic and prioritizing tasks on phone switching systems to enable more robust service during peak calling times. At Bell Laboratories where she worked for over 32 years, Hoover was described as an important pioneer for women in the field of computer technology.",
    url: "https://en.wikipedia.org/wiki/Erna_Schneider_Hoover",
    backlinks: 1145,
    birthYear: 1926,
    references: 14,
    position: { x: 8, y: 20, z: -7 }
  },
  {
    name: "Jude Milhon",
    year: 1973,
    fields: "Hacker, author",
    shortSummary: "Coined the term cypherpunk and maintained Community Memory, the first public computerized bulletin board system.",
    summary: "Judith [Jude] Milhon (March 12, 1939 – July 19, 2003), in Washington D.C., best known by her pseudonym St. Jude, was a hacker and author in the San Francisco Bay Area. Milhon coined the term cypherpunk and was a founding member of the cypherpunks. On July 19, 2003, Milhon died of cancer.",
    url: "https://en.wikipedia.org/wiki/Jude_Milhon",
    backlinks: 28,
    birthYear: 1939,
    references: 5,
    position: { x: 12, y: 6, z: 3 }
  },
  {
    name: "Carol Shaw",
    year: 1980,
    fields: "Video game designer and programmer",
    shortSummary: "Considered to the first modern female games designer, released a 3D version of tic-tac-toe for the Atari 2600.",
    summary: "Carol Shaw (born 1955) was one of the first female game designers and programmers in the video game industry. She is best known for creating the Atari 2600 vertically scrolling shooter River Raid (1982) for Activision. She worked for Atari, Inc. from 1978-1980 where she designed multiple games including 3-D Tic-Tac-Toe (1978) and Video Checkers (1980), both for the Atari 2600. She left game development in 1984 and retired in 1990.",
    url: "https://en.wikipedia.org/wiki/Carol_Shaw",
    backlinks: 16,
    birthYear: 1955,
    references: 14,
    position: { x: 18, y: 4, z: -10 }
  },
  {
    name: "Roberta Williams",
    year: 1980,
    fields: "Video game designer, writer, co-founder",
    shortSummary: "Pioneered the graphic adventure game format in Mystery House and the King's Quest series.",
    summary: "Roberta Williams (born February 16, 1953) is an American video game designer, writer, and a co-founder of Sierra On-Line (later known as Sierra Entertainment), who developed her first game while living in Simi Valley, California. She is most famous for her work in the field of graphic adventure games with titles such as Mystery House, the King's Quest series, and Phantasmagoria. She is married to Ken Williams and retired in 1999. Roberta Williams is one of the most influential PC game designers of the 1980s and 1990s, and has been credited with creating the graphic adventure genre.",
    url: "https://en.wikipedia.org/wiki/Roberta_Williams",
    backlinks: 194,
    birthYear: 1953,
    references: 25,
    position: { x: 20, y: 14, z: 7 }
  },
  {
    name: "Susan Kare",
    year: 1984,
    fields: "Artist, graphic designer",
    shortSummary: "Designed the original icons for the Macintosh, including the moving watch, paintbrush and trash can.",
    summary: "Susan Kare (born February 5, 1954) is an artist and graphic designer best known for her interface elements and typeface contributions to the first Apple Macintosh in the 1980s. She was also Creative Director (and one of the original employees) at NeXT, the company formed by Steve Jobs after he left Apple in 1985 and has since contributed at Microsoft, IBM, Facebook, and Pinterest.",
    url: "https://en.wikipedia.org/wiki/Susan_Kare",
    backlinks: 153,
    birthYear: 1954,
    references: 30,
    position: { x: 25, y: 11, z: -4 }
  },
  {
    name: "Radia Perlman",
    year: 1985,
    fields: "Computer programmer, network engineer",
    shortSummary: "Came up with a way to route information packets in an \"infinitely scalable\" way that allowed large networks like the Internet to function.",
    summary: "Radia Joy Perlman (born 1951) is an American computer programmer and network engineer. She is most famous for her invention of the spanning-tree protocol (STP), which is fundamental to the operation of network bridges, while working for Digital Equipment Corporation. She also made large contributions to many other areas of network design and standardization, such as link-state routing protocols.",
    url: "https://en.wikipedia.org/wiki/Radia_Perlman",
    backlinks: 1242,
    birthYear: 1951,
    references: 20,
    position: { x: 28, y: 23, z: 2 }
  },
  {
    name: "Jaime Levy",
    year: 1990,
    fields: "Author, lecturer, interace designer, user experience strategist",
    shortSummary: "Created one of the first e-Zines, CyberRag, which included articles, games and animations loaded onto diskettes.",
    summary: "Jaime Levy is an American author, lecturer, interface designer, and user experience strategist. She first became known for her new media projects in the 1990s. Her best-known projects include the floppy disk distributed with Billy Idol's album Cyberpunk, WORD, an online magazine, and an online cartoon series, CyberSlacker.",
    url: "https://en.wikipedia.org/wiki/Jaime_Levy",
    backlinks: 19,
    birthYear: 1966,
    references: 37,
    position: { x: 32, y: 5, z: 9 }
  },
  {
    name: "Nancy Hafkin",
    year: 1990,
    fields: "Networking pioneer",
    shortSummary: "Worked on networking and enabling email connections in 10 African countries.",
    summary: "Nancy Hafkin is a pioneer of networking and development information and electronic communications in Africa, spurring the Pan African Development Information System (PADIS) of the United Nations Economic Commission for Africa (UNECA) from 1987 until 1997. Nancy Hafkin played a role in facilitating the Association for Progressive Communications' work to enable email connectivity in more than 10 countries during the early 1990s, before full Internet connectivity became a reality in most of Africa.",
    url: "https://en.wikipedia.org/wiki/Nancy_Hafkin",
    backlinks: 87,
    birthYear: null,
    references: 5,
    position: { x: 34, y: 9, z: -6 }
  },
  {
    name: "Hu Qiheng",
    year: 1994,
    fields: "Computer scientist",
    shortSummary: "Leader of the team who installed the first TCP/IP connection for China",
    summary: "Hu Qiheng (born 1934) is a Chinese computer scientist. Hu was the vice president of the Chinese Academy of Sciences from 1987 to 1996 and led the National Computing and Networking Facility of China which connected China to the Internet in April 1994. Hu was inducted into the Internet Hall of Fame in 2013 as a global connector.",
    url: "https://en.wikipedia.org/wiki/Hu_Qiheng",
    backlinks: 86,
    birthYear: 1934,
    references: 9,
    position: { x: 38, y: 10, z: 4 }
  },
  {
    name: "Lucy Sanders",
    year: 2004,
    fields: "CEO",
    shortSummary: "Founded the National Center for Women & Information Technology to address the gender gap in computing.",
    summary: "Lucinda 'Lucy' Sanders (born 1954) is the current CEO and a co-founder of the National Center for Women & Information Technology. She is the recipient of many distinguished honors in the STEM fields, including induction into the US News STEM Leadership Hall of Fame in 2013.",
    url: "https://en.wikipedia.org/wiki/Lucy_Sanders",
    backlinks: 19,
    birthYear: 1954,
    references: 19,
    position: { x: 42, y: 6, z: -8 }
  },
  {
    name: "Mary Lou Jepsen",
    year: 2005,
    fields: "Technical executive, inventor",
    shortSummary: "Prolific inventor in the fields of display, imaging, and computer hardware, and the co-founder and CTO of One Laptop Per Child",
    summary: "Mary Lou Jepsen (born 1965) is a technical executive and inventor in the fields of display, imaging, and computer hardware. Her contributions have had worldwide adoption in head-mounted display, HDTV, laptop computers, and projector products; she was the technical force behind a generation of low-cost computing, and innovative consumer and medical imaging technologies.",
    url: "https://en.wikipedia.org/wiki/Mary_Lou_Jepsen",
    backlinks: 49,
    birthYear: 1965,
    references: 48,
    position: { x: 44, y: 8, z: 6 }
  },
  {
    name: "Coraline Ada Ehmke",
    year: 2014,
    fields: "Software developer, open source advocate",
    shortSummary: "Drafted the Contributor Covenant to bring inclusion to the world of open source project development.",
    summary: "Coraline Ada Ehmke is a software developer and open source advocate based in Chicago, Illinois. She began her career as a web developer in 1994 and has worked in a variety of industries, including engineering, consulting, education, advertising, healthcare, and software development infrastructure. She is known for her work in Ruby, and in 2016 earned the Ruby Hero award at RailsConf, a conference for Ruby on Rails developers. She is also known for her social justice work and activism, the creation of Contributor Covenant, and promoting the widespread adoption of codes of conduct for open source projects and communities.",
    url: "https://en.wikipedia.org/wiki/Coraline_Ada_Ehmke",
    backlinks: 29,
    birthYear: null,
    references: 37,
    position: { x: 48, y: 7, z: -2 }
  }
] satisfies readonly Woman[]

export default women
