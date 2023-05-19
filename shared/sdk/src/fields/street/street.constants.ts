import { FieldFamily } from '../field.enum';

export interface Street {
  name: string;
  family: FieldFamily;
  upgradePrice: number;
  members: { price: number; rentMatrix: number[] }[];
}

export const STREET_GREY: Street = {
  name: 'Grey Street',
  family: FieldFamily.StreetGrey,
  upgradePrice: 500,
  members: [
    { price: 500, rentMatrix: [50, 100, 350, 1150, 2000, 3000] },
    { price: 600, rentMatrix: [50, 150, 400, 1200, 2500, 3500] },
  ],
};

export const STREET_ORANGE: Street = {
  name: 'Orange Street',
  family: FieldFamily.StreetOrange,
  upgradePrice: 600,
  members: [
    { price: 1000, rentMatrix: [60, 250, 850, 2600, 3500, 5000] },
    { price: 1100, rentMatrix: [60, 350, 950, 2800, 4000, 5500] },
    { price: 1200, rentMatrix: [70, 400, 1000, 3000, 4500, 6000] },
  ],
};

export const STREET_YELLOW: Street = {
  name: 'Yellow Street',
  family: FieldFamily.StreetYellow,
  upgradePrice: 1000,
  members: [
    { price: 1400, rentMatrix: [100, 450, 1500, 4600, 6000, 7500] },
    { price: 1500, rentMatrix: [100, 550, 1600, 4800, 6500, 8000] },
    { price: 1600, rentMatrix: [125, 600, 1900, 5000, 7000, 8500] },
  ],
};

export const STREET_GREEN: Street = {
  name: 'Green Street',
  family: FieldFamily.StreetGreen,
  upgradePrice: 1100,
  members: [
    { price: 1800, rentMatrix: [150, 650, 2000, 5000, 7000, 9000] },
    { price: 1900, rentMatrix: [150, 750, 2100, 5500, 7500, 9500] },
    { price: 2000, rentMatrix: [175, 800, 2200, 6000, 8000, 10000] },
  ],
};

export const STREET_PURPLE: Street = {
  name: 'Purple Street',
  family: FieldFamily.StreetPurple,
  upgradePrice: 1500,
  members: [
    { price: 2100, rentMatrix: [175, 850, 2300, 6500, 8500, 10000] },
    { price: 2200, rentMatrix: [175, 950, 2800, 7000, 9000, 10500] },
    { price: 2300, rentMatrix: [200, 1000, 3200, 7500, 9500, 11000] },
  ],
};

export const STREET_WHITE: Street = {
  name: 'White Street',
  family: FieldFamily.StreetWhite,
  upgradePrice: 1600,
  members: [
    { price: 2500, rentMatrix: [225, 1100, 3300, 8000, 9500, 11000] },
    { price: 2600, rentMatrix: [225, 1150, 3400, 8000, 9500, 11000] },
    { price: 2700, rentMatrix: [250, 1200, 3500, 8500, 10000, 12000] },
  ],
};

export const STREET_BLUE: Street = {
  name: 'Blue Street',
  family: FieldFamily.StreetBlue,
  upgradePrice: 1700,
  members: [
    { price: 2800, rentMatrix: [275, 1300, 4000, 9000, 11000, 13000] },
    { price: 2900, rentMatrix: [275, 1400, 4200, 9500, 11000, 13500] },
    { price: 3000, rentMatrix: [300, 1500, 4500, 10000, 11500, 14000] },
  ],
};

export const STREET_RED: Street = {
  name: 'Red Street',
  family: FieldFamily.StreetRed,
  upgradePrice: 2000,
  members: [
    { price: 4000, rentMatrix: [400, 1800, 5000, 11000, 12500, 16000] },
    { price: 4500, rentMatrix: [600, 1900, 5500, 13500, 17000, 20000] },
  ],
};
