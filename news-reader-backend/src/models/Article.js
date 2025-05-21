import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Category from './Category.js';

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sourceUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define relationship
Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Article, { foreignKey: 'categoryId', as: 'articles' });

export default Article;