/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const AWW_COMMAND = {
  name: 'awwww',
  description: 'Drop some cuteness on this channel.',
};

export const INVITE_COMMAND = {
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
};

export const TEST_COMMAND = {
  name: 'ping',
  description: 'ping!',
};

export const HELP = {
  name: 'help',
  description: 'help!',
};
export const LOG = {
  name: 'log',
  description: 'log!',
  options: [
    {
      type: 3, // string を表す定数
      name: "行列名",
      required: true,
      description:"行列名"
    }
  ]
};

export const ADD_ACOUNT = {
  name: "アカウントの登録",
  description: "アカウントを登録します",
  options: [
    {
      type: 3, // string を表す定数
      name: "mcid",
      required: true,
      description:"test"
    }
  ]
}
export const ADD_SHOP = {
  name: "shopの登録",
  description: "shopを登録します",
  options: [
    {
      type: 3, // string を表す定数
      name: "shop-id",
      required: true,
      description:"test"
    }
  ]
}