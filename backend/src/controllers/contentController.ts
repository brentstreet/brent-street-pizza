import { Request, Response } from 'express';
import prisma from '../config/db';

export const getUIContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const contents = await prisma.uIContent.findMany();
    
    // Group by section for easier frontend consumption
    const grouped = contents.reduce((acc: any, item) => {
      if (!acc[item.section]) acc[item.section] = {};
      
      let val: any = item.value;
      if (item.type === 'json') {
        try {
          val = JSON.parse(item.value);
        } catch (e) {
          console.error(`Failed to parse JSON for ${item.section}.${item.key}`);
        }
      }
      
      acc[item.section][item.key] = val;
      return acc;
    }, {});

    res.status(200).json({ content: grouped });
  } catch (err) {
    console.error('Error fetching UI content:', err);
    res.status(500).json({ error: 'Internal server error while fetching UI content' });
  }
};
