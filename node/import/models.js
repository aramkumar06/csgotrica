/**
 * @module models
 */

var Sequelize = require('sequelize');
var db = require('./db');

/**
 * event table definition
 *
 * @memberof module:models
 * @type {object}
 * @property {number} tick
 * @property {string} name
 * @property {object} data
 * @property {string[]} locations
 * @property {string[]} entities
 */
var Event = db.define('event', {
  tick: {type: Sequelize.INTEGER, allowNull: false},
  name: {type: Sequelize.STRING, allowNull: false},
  data: {type: Sequelize.JSONB, allowNull: false},
  locations: {type: Sequelize.JSONB},
  entities: {type: Sequelize.JSONB}
}, {
  indexes: [
    {
      fields: ['name', 'map_mms_id']
    },
    {
      fields: ['data'],
      using: 'gin',
      operator: 'jsonb_ops'
    },
    {
      fields: ['entities'],
      using: 'gin',
      operator: 'jsonb_ops'
    },
    {
      fields: ['locations'],
      using: 'gin',
      operator: 'jsonb_ops'
    }
  ]
});

/**
 * entity_prop table definition
 *
 * @memberof module:models
 * @type {object}
 * @property {number} index
 * @property {number} tick
 * @property {string} prop
 * @property {{value: *}} value
 */
var EntityProp = db.define('entity_prop', {
  index: {type: Sequelize.INTEGER, allowNull: false},
  tick: {type: Sequelize.INTEGER, allowNull: false},
  prop: {type: Sequelize.STRING, allowNull: false},
  value: {type: Sequelize.JSONB, allowNull: false}
}, {
  indexes: [
    {
      fields: ['index', 'prop', 'map_mms_id', 'tick']
    },
    {
      fields: ['map_mms_id']
    },
    {
      method: 'BTREE',
      fields: ['tick']
    },
    {
      fields: ['value'],
      using: 'gin',
      operator: 'jsonb_path_ops'
    }
  ]
});

/**
 * map model
 * @memberof module:models
 * @type {object}
 * @property {string} title
 * @property {string} level
 * @property {string} game
 * @property {object} data
 * @property {number} tickrate
 */
var Map = db.define('map', {
  title: {type: Sequelize.STRING, allowNull: false},
  level: {type: Sequelize.STRING, allowNull: false},
  game: {type: Sequelize.STRING, allowNull: false},
  data: {type: Sequelize.JSONB},
  tickrate: {type: Sequelize.INTEGER, allowNull: false},
  date: {type: Sequelize.DATE, allowNull: false},
  mms_data: {type: Sequelize.JSONB, allowNull: true},
  mms_id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true}, // MatchMapStat ID
  match_id: {type: Sequelize.INTEGER, allowNull: false}
});

var Match = db.define('match', {
  match_id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
  date: {type: Sequelize.DATE, allowNull: false},
  data: {type: Sequelize.JSONB},
  maps_played: {type: Sequelize.INTEGER, allowNull: false},
  maps: {type: Sequelize.INTEGER, allowNull: false}
});

Map.hasMany(Event, {allowNull: false, onDelete: 'cascade'});
Map.hasMany(EntityProp, {allowNull: false, onDelete: 'cascade'});

module.exports = {
  Map,
  Event,
  EntityProp,
  Match
};
