import { EntitySchema } from "typeorm";

const ALLOWED_DIET = ["vegetarian", "vegan", "pescatarian", "none"];
const ALLOWED_SKILL = ["beginner", "intermediate", "expert"];

const DietaryPreference = Object.freeze({
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
  PESCATARIAN: "pescatarian",
  NONE: "none",
});

const CookingSkillLevel = Object.freeze({
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  EXPERT: "expert",
});

export const UserProfile = new EntitySchema({
  name: "UserProfile",
  tableName: "user_profiles",
  columns: {
    user_id: {
      primary: true,
      type: "int",
    },
    dietary_preference: {
      type: "enum",
      enum: Object.values(DietaryPreference),
      default: DietaryPreference.NONE,
    },
    allergies: { type: "text", nullable: true },
    cooking_skill_level: {
      type: "enum",
      enum: Object.values(CookingSkillLevel),
      default: CookingSkillLevel.BEGINNER,
    },
    created_at: { type: "timestamp", createDate: true },
    updated_at: { type: "timestamp", updateDate: true },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      inverseSide: "profile", // matches User.profile
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
});
