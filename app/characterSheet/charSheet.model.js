const mongoose = require('mongoose');
const Joi = require('joi');

const charSheetSchema = new mongoose.Schema({
    //user name = player name duh
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    
    //stuff that probably won't change
    charName: {type: String, required: true},
    class: {type: String, required: true},
    level: {type: Number, required: true}, 
    race: {type: String, required: true},
    background: {type: String, required: true},
    alignment: {type: String, required: true},
    
    // stuff that can change
    exp: {type: Number, required: true}, 
    proficiencyBonus: {type: Number, required: true}, 
    inspiration: {type: Number, required: false},
    strength: {type: Number, required: true}, 
    dexterity: {type: Number, required: true}, 
    constitution: {type: Number, required: true}, 
    intelligence: {type: Number, required: true}, 
    wisdom: {type: Number, required: true}, 
    charisma: {type: Number, required: true} 
});

charSheetSchema.methods.serialize = function() {
    let user;
    if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {


        id: this._id,
        user: user,
        charName: this.charName,
        class: this.class,
        level: this.level,
        race: this.race,
        background: this.background,
        alignment: this.alignment,
        exp: this.exp,
        inspiration: this.inspiration,
        strength: this.strength,
        dexterity: this.dexterity,
        constitution: this.constitution,
        intelligence: this.intelligence,
        wisdom: this.wisdom,
        charisma: this.charisma

    }
};

const charSheetJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    charName: Joi.string().min(1).required(),
    class: Joi.string().min(1).required(),
    level: Joi.number().required(),
    race: Joi.string().min(1).required(),
    class: Joi.string().min(1).required(),
    background: Joi.string().min(1).required(),
    alignment: Joi.string().min(1).required(),
    exp: Joi.number().min(1).required(),
    inspiration: Joi.number().optional(),
    strength: Joi.number().min(1).required(),
    dexterity: Joi.number().min(1).required(),
    constitution: Joi.number().min(1).required(),
    intelligence: Joi.number().min(1).required(),
    wisdom: Joi.number().min(1).required(),
    charisma: Joi.number().min(1).required()
}); 

const CharSheet = mongoose.model ('charSheet', charSheetSchema);
module.exports = { CharSheet, charSheetJoiSchema};