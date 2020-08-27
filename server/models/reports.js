const { INTEGER, STRING, JSON, BOOLEAN, JSONB, DATEONLY } = require('sequelize')

module.exports = sequelize => sequelize.define('report', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  reportId: {
    type: STRING
  },
  workQ: {
    type: JSON,
  },
  approvals: {
    type: JSONB,
    defaultValue: {
      seo: false,
      da: false,
      cc: false
    }
  },
  from: {
    type: DATEONLY
  },
  to: {
    type: DATEONLY
  },
  clientUrn: {
    type: STRING
  }
})
