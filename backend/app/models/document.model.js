module.exports = (sequelize, Sequelize) => {
  const Document = sequelize.define("documents", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    hashValue: {
      type: Sequelize.STRING
    },
    issued: {
      type: Sequelize.BOOLEAN
    },
    revoked: {
      type: Sequelize.BOOLEAN
    },
    sharedEmail: {
      type: Sequelize.STRING
    },
    file: {
      type: Sequelize.STRING
    }
  });

  return Document;
};
