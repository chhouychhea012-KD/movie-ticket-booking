import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type DiscountType = 'percentage' | 'fixed';

interface CouponAttributes {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number;
  validUntil: Date;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CouponCreationAttributes extends Optional<CouponAttributes, 'id' | 'description' | 'isActive'> {}

class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  public id!: string;
  public code!: string;
  public description?: string;
  public discountType!: DiscountType;
  public discountValue!: number;
  public minPurchase!: number;
  public validUntil!: Date;
  public maxUses!: number;
  public usedCount!: number;
  public isActive!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  // Helper method to validate coupon
  public isValid(amount: number): { valid: boolean; discount: number; message: string } {
    if (!this.isActive) {
      return { valid: false, discount: 0, message: 'Coupon is not active' };
    }
    
    if (new Date(this.validUntil) < new Date()) {
      return { valid: false, discount: 0, message: 'Coupon has expired' };
    }
    
    if (this.usedCount >= this.maxUses) {
      return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
    }
    
    if (amount < this.minPurchase) {
      return { valid: false, discount: 0, message: `Minimum purchase of $${this.minPurchase} required` };
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
      discount = amount * (this.discountValue / 100);
    } else {
      discount = this.discountValue;
    }

    return { 
      valid: true, 
      discount, 
      message: `${this.discountType === 'percentage' ? this.discountValue + '%' : '$' + this.discountValue} discount applied!` 
    };
  }
}

Coupon.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minPurchase: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    validUntil: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    maxUses: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
  }
);

export default Coupon;