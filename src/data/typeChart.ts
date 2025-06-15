// src/data/typeChart.ts
// Effektivitäts-Matrix (Gen VI+), deutsche Namen, alles kleingeschrieben.
// Es stehen NUR Abweichungen von 1× drin: 2, 0.5 oder 0.
// Umlaute sind bereits „gesluggt“ (käfer → kaefer).

export const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: {
    gestein: 0.5,
    stahl: 0.5,
    geist: 0,
  },

  feuer: {
    pflanze: 2,
    eis: 2,
    kaefer: 2,
    stahl: 2,
    feuer: 0.5,
    wasser: 0.5,
    gestein: 0.5,
    drache: 0.5,
  },

  wasser: {
    feuer: 2,
    boden: 2,
    gestein: 2,
    wasser: 0.5,
    pflanze: 0.5,
    drache: 0.5,
  },

  pflanze: {
    wasser: 2,
    boden: 2,
    gestein: 2,
    feuer: 0.5,
    pflanze: 0.5,
    gift: 0.5,
    flug: 0.5,
    kaefer: 0.5,
    drache: 0.5,
    stahl: 0.5,
  },

  elektro: {
    wasser: 2,
    flug: 2,
    pflanze: 0.5,
    elektro: 0.5,
    drache: 0.5,
    boden: 0,
  },

  eis: {
    pflanze: 2,
    boden: 2,
    flug: 2,
    drache: 2,
    feuer: 0.5,
    wasser: 0.5,
    eis: 0.5,
    stahl: 0.5,
  },

  kampf: {
    normal: 2,
    eis: 2,
    gestein: 2,
    unlicht: 2,
    stahl: 2,
    gift: 0.5,
    flug: 0.5,
    psycho: 0.5,
    kaefer: 0.5,
    fee: 0.5,
    geist: 0,
  },

  gift: {
    pflanze: 2,
    fee: 2,
    gift: 0.5,
    boden: 0.5,
    gestein: 0.5,
    geist: 0.5,
    stahl: 0,
  },

  boden: {
    feuer: 2,
    elektro: 2,
    gift: 2,
    gestein: 2,
    stahl: 2,
    pflanze: 0.5,
    kaefer: 0.5,
    flug: 0,
  },

  flug: {
    pflanze: 2,
    kampf: 2,
    kaefer: 2,
    elektro: 0.5,
    gestein: 0.5,
    stahl: 0.5,
  },

  psycho: {
    kampf: 2,
    gift: 2,
    psycho: 0.5,
    stahl: 0.5,
    unlicht: 0,
  },

  kaefer: {
    pflanze: 2,
    psycho: 2,
    unlicht: 2,
    feuer: 0.5,
    kampf: 0.5,
    gift: 0.5,
    flug: 0.5,
    geist: 0.5,
    stahl: 0.5,
    fee: 0.5,
  },

  gestein: {
    feuer: 2,
    eis: 2,
    flug: 2,
    kaefer: 2,
    kampf: 0.5,
    boden: 0.5,
    stahl: 0.5,
  },

  geist: {
    geist: 2,
    psycho: 2,
    unlicht: 0.5,
    normal: 0,
  },

  drache: {
    drache: 2,
    stahl: 0.5,
    fee: 0,
  },

  unlicht: {
    geist: 2,
    psycho: 2,
    kampf: 0.5,
    unlicht: 0.5,
    fee: 0.5,
  },

  stahl: {
    eis: 2,
    gestein: 2,
    fee: 2,
    feuer: 0.5,
    wasser: 0.5,
    elektro: 0.5,
    stahl: 0.5,
  },

  fee: {
    kampf: 2,
    drache: 2,
    unlicht: 2,
    feuer: 0.5,
    gift: 0.5,
    stahl: 0.5,
  },
}
