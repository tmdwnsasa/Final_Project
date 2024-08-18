class CharacterSkill {
  constructor(skill_id, skill_name, skill_type, character_id, damage_factor, cool_time, range_x, range_y, scale) {
    this.skill_id = skill_id;
    this.skill_name = skill_name;
    this.skill_type = skill_type;
    this.character_id = character_id;
    this.damage_factor = damage_factor;
    this.cool_time = cool_time;
    this.range_x = range_x;
    this.range_y = range_y;
    this.scale = scale;
  }
}

export default CharacterSkill;
