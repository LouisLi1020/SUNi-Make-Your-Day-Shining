import { Request, Response, NextFunction } from 'express';

// Simple validation middleware for profile updates
export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, profile } = req.body;
  const errors: string[] = [];

  // Validate name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 2 || name.length > 50) {
      errors.push('Name must be between 2 and 50 characters');
    }
  }

  // Validate profile fields
  if (profile) {
    if (profile.firstName && (typeof profile.firstName !== 'string' || profile.firstName.length < 1 || profile.firstName.length > 25)) {
      errors.push('First name must be between 1 and 25 characters');
    }

    if (profile.lastName && (typeof profile.lastName !== 'string' || profile.lastName.length < 1 || profile.lastName.length > 25)) {
      errors.push('Last name must be between 1 and 25 characters');
    }

    if (profile.phone && typeof profile.phone !== 'string') {
      errors.push('Phone must be a valid string');
    }

    if (profile.gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(profile.gender)) {
      errors.push('Gender must be one of: male, female, other, prefer-not-to-say');
    }

    if (profile.dateOfBirth) {
      const birthDate = new Date(profile.dateOfBirth);
      if (isNaN(birthDate.getTime())) {
        errors.push('Date of birth must be a valid date');
      } else {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13 || age > 120) {
          errors.push('Age must be between 13 and 120 years');
        }
      }
    }

    if (profile.bio && (typeof profile.bio !== 'string' || profile.bio.length > 500)) {
      errors.push('Bio must be less than 500 characters');
    }

    if (profile.location && (typeof profile.location !== 'string' || profile.location.length > 100)) {
      errors.push('Location must be less than 100 characters');
    }

    if (profile.website && typeof profile.website !== 'string') {
      errors.push('Website must be a valid string');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Simple validation middleware for preferences
export const validatePreferences = (req: Request, res: Response, next: NextFunction) => {
  const { preferences } = req.body;
  const errors: string[] = [];

  if (preferences) {
    if (preferences.language && !['en', 'zh-TW', 'zh-CN', 'ja', 'ko'].includes(preferences.language)) {
      errors.push('Language must be one of: en, zh-TW, zh-CN, ja, ko');
    }

    if (preferences.currency && !['USD', 'TWD', 'CNY', 'JPY', 'KRW'].includes(preferences.currency)) {
      errors.push('Currency must be one of: USD, TWD, CNY, JPY, KRW');
    }

    if (preferences.timezone && (typeof preferences.timezone !== 'string' || preferences.timezone.length < 1 || preferences.timezone.length > 50)) {
      errors.push('Timezone must be between 1 and 50 characters');
    }

    if (preferences.notifications) {
      if (preferences.notifications.email !== undefined && typeof preferences.notifications.email !== 'boolean') {
        errors.push('Email notifications must be a boolean');
      }
      if (preferences.notifications.sms !== undefined && typeof preferences.notifications.sms !== 'boolean') {
        errors.push('SMS notifications must be a boolean');
      }
      if (preferences.notifications.push !== undefined && typeof preferences.notifications.push !== 'boolean') {
        errors.push('Push notifications must be a boolean');
      }
    }

    if (preferences.marketing !== undefined && typeof preferences.marketing !== 'boolean') {
      errors.push('Marketing preferences must be a boolean');
    }

    if (preferences.privacy) {
      if (preferences.privacy.profileVisibility && !['public', 'friends', 'private'].includes(preferences.privacy.profileVisibility)) {
        errors.push('Profile visibility must be one of: public, friends, private');
      }
      if (preferences.privacy.showEmail !== undefined && typeof preferences.privacy.showEmail !== 'boolean') {
        errors.push('Show email preference must be a boolean');
      }
      if (preferences.privacy.showPhone !== undefined && typeof preferences.privacy.showPhone !== 'boolean') {
        errors.push('Show phone preference must be a boolean');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Simple validation middleware for avatar upload
export const validateAvatarUpload = (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl } = req.body;
  const errors: string[] = [];

  if (!imageUrl || typeof imageUrl !== 'string') {
    errors.push('Image URL is required and must be a string');
  } else {
    try {
      const url = new URL(imageUrl);
      const allowedDomains = [
        'localhost',
        'cloudinary.com',
        'amazonaws.com',
        'googleapis.com'
      ];
      
      const isAllowed = allowedDomains.some(domain => 
        url.hostname.includes(domain)
      );
      
      if (!isAllowed) {
        errors.push('Image URL must be from an allowed domain');
      }
    } catch (error) {
      errors.push('Invalid image URL format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Simple validation middleware for account deletion
export const validateAccountDeletion = (req: Request, res: Response, next: NextFunction) => {
  const { password, confirmation } = req.body;
  const errors: string[] = [];

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  if (confirmation !== 'DELETE') {
    errors.push('Confirmation must be exactly "DELETE"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};