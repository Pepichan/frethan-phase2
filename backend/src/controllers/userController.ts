import { Request, Response } from 'express';
import { prisma } from '../app';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      status: 'success',
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, userEmail } = req.body;
    
    if (!firstName || !lastName || !userEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'First name, last name, and email are required'
      });
    }

    const user = await prisma.user.create({
      data: { firstName, lastName, userEmail, roleId: 1, passwordHash: '', }
    });

    res.status(201).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create user'
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, userEmail } = req.body;

    if (!firstName && !lastName && !userEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one field (first name, last name, or email) is required for update'
      });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(userEmail && { userEmail }), },
    });

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
};
