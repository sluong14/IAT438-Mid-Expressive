/* ===========================================================
   SSFB — shared festival data
   =========================================================== */

const FESTIVAL_DATA = {

  clusters: [
    {
      id: 'ambient',
      genre: 'AMBIENT',
      genreLabel: 'JAZZ',
      stage: 'A',
      nextSet: '22:00',
      barRange: [0.06, 0.20],     // fraction of total bar field width
      artists: [
        { name: 'GESLOTEN CIRKEL', stage: 'RUSH HOUR',     time: '14:00', playingNow: true,  freq: 64  },
        { name: 'PEDER MANNERFELT', stage: 'RED LIGHT RADIO', time: '15:00', playingNow: false, freq: 110 },
        { name: 'CLARA Y MAOUPA',   stage: 'RED LIGHT RADIO', time: '16:00', playingNow: false, freq: 96  },
        { name: 'PADDISH SMITH',    stage: 'RED LIGHT RADIO', time: '17:00', playingNow: false, freq: 132 },
      ]
    },
    {
      id: 'noise-industrial',
      genre: 'NOISE/INDUSTRIAL',
      genreLabel: 'INDUSTRIAL',
      stage: 'B',
      nextSet: '19:00',
      barRange: [0.30, 0.46],
      artists: [
        { name: 'PARRISH SMITH',   stage: 'RED LIGHT RADIO', time: '17:00', playingNow: true,  freq: 55  },
        { name: 'CLARA Y MAOUPA',  stage: 'RED LIGHT RADIO', time: '16:00', playingNow: false, freq: 96  },
        { name: 'KASIMYN',         stage: 'WAREHOUSE STAGE', time: '18:00', playingNow: false, freq: 70  },
        { name: 'EVITA MANJI',     stage: 'WAREHOUSE STAGE', time: '20:00', playingNow: false, freq: 145 },
      ]
    },
    {
      id: 'electronica',
      genre: 'ELECTRONICA',
      genreLabel: 'IDM',
      stage: 'C',
      nextSet: '21:00',
      barRange: [0.55, 0.71],
      artists: [
        { name: 'JLIN',            stage: 'MAIN STAGE',     time: '21:00', playingNow: true,  freq: 88  },
        { name: 'OBJEKT',          stage: 'MAIN STAGE',     time: '22:00', playingNow: false, freq: 120 },
        { name: 'KOENRAAD',        stage: 'RED LIGHT RADIO', time: '23:00', playingNow: false, freq: 102 },
        { name: 'PARRISH SMITH',   stage: 'RED LIGHT RADIO', time: '17:00', playingNow: false, freq: 55  },
      ]
    },
    {
      id: 'techno',
      genre: 'TECHNO',
      genreLabel: 'ACID',
      stage: 'D',
      nextSet: '23:00',
      barRange: [0.80, 0.96],
      artists: [
        { name: 'SURGEON',         stage: 'MAIN STAGE',     time: '23:30', playingNow: true,  freq: 48  },
        { name: 'BLAWAN',          stage: 'MAIN STAGE',     time: '00:30', playingNow: false, freq: 60  },
        { name: 'GESLOTEN CIRKEL', stage: 'RUSH HOUR',      time: '14:00', playingNow: false, freq: 64  },
        { name: 'JLIN',            stage: 'MAIN STAGE',     time: '21:00', playingNow: false, freq: 88  },
      ]
    },
  ],

  // "you might also like" — artists revealed on swipe
  recommended: [
    {
      name: 'PARRISH SMITH',
      genre: 'NOISE/INDUSTRIAL',
      stage: 'RED LIGHT RADIO',
      time: '17:00',
      barPos: 0.27,
      freq: 55,
      cover: 'parrish.png',
      coverGradient: 'linear-gradient(135deg,#5b6d7a 0%, #2a323a 60%, #10141a 100%)'
    },
    {
      name: 'CLARA Y MAOUPA',
      genre: 'NOISE/INDUSTRIAL',
      stage: 'RED LIGHT RADIO',
      time: '16:00',
      barPos: 0.78,
      freq: 96,
      cover: 'clara.png',
      coverGradient: 'linear-gradient(135deg,#7a8b94 0%, #3a4750 55%, #14181c 100%)'
    },
  ]
};