import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const getCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coupons',
      error: error.message,
    });
  }
};

export const getCouponByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ where: { code } });

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
      return;
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    console.error('Get coupon by code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coupon',
      error: error.message,
    });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error: any) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coupon',
      error: error.message,
    });
  }
};

export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
      return;
    }

    await coupon.update(req.body);

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon,
    });
  } catch (error: any) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon',
      error: error.message,
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
      return;
    }

    await coupon.destroy();

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon',
      error: error.message,
    });
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const { amount } = req.body;

    const coupon = await Coupon.findOne({ where: { code } });

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
        valid: false,
        discount: 0,
      });
      return;
    }

    const validation = coupon.isValid(amount);

    res.json({
      success: true,
      valid: validation.valid,
      discount: validation.discount,
      message: validation.message,
    });
  } catch (error: any) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate coupon',
      error: error.message,
    });
  }
};