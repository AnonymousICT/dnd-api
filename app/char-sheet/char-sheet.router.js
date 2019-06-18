const express = require('express');
const Joi = require('joi');
const charSheetRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { CharSheet, charSheetJoiSchema} = require('./char-sheet.model.js');

// CREATE NEW CHARACTER SHEET
charSheetRouter.post('/', jwtPassportMiddleware, (req,res)=>{
    const newCharSheet = {
        user: req.user.id,
        charName: req.body.charName,
        level: req.body.level,
        alignment: req.body.alignment,
        background: req.body.background,
        exp: req.body.exp,
        proficiencyBonus: req.body.proficiencyBonus,
        inspiration: req.body.inspiration,
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        constitution: req.body.constitution,
        intelligence: req.body.intelligence,
        wisdom: req.body.wisdom,
        charisma: req.body.charisma
    };

    const validation = Joi.validate(newCharSheet, charSheetJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    CharSheet.create(newCharSheet)
        .then(createdCharSheet => {
            return res.status(HTTP_STATUS_CODES.CREATED).json(createdCharSheet.serialize());
        })
        .catch(error =>{
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

//GET USER'S CHARACTER SHEETS
charSheetRouter.get('/', jwtPassportMiddleware, (req,res)=>{
    CharSheet.find({user: req.user.id})
        .populate('user')
        .then(charSheets =>{
            return res.status(HTTP_STATUS_CODES.OK).json(charSheets.map(charSheet => charSheet.serialize()));
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
})

//GET ALL CHARACTER SHEETS
charSheetRouter.get('/all', (req,res)=> {
    CharSheet.find()
        .populate('user')
        .then(charSheets => {
            return res.status(HTTP_STATUS_CODES.OK).json(charSheets.map(charSheet => charSheet.serialize()));
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        })
})

//GET ONE CHARACTER SHEET BY ID
charSheetRouter.get('/:charSheetId', (req, res) => {
    CharSheet.findById(req.params.charSheetId)
        .populate('user')
        .then(charSheet => {
            return res.status(HTTP_STATUS_CODES.OK).json(charSheet.serialize());
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        })
})

//UPDATE CHARACTER SHEET BY ID
charSheetRouter.put('/:charSheetId', jwtPassportMiddleware, (req, res) => {
    const charSheetUpdate = {
        charName: req.body.charName,
        level: req.body.level,
        alignment: req.body.alignment,
        background: req.body.background,
        exp: req.body.exp,
        proficiencyBonus: req.body.proficiencyBonus,
        inspiration: req.body.inspiration,
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        constitution: req.body.constitution,
        intelligence: req.body.intelligence,
        wisdom: req.body.wisdom,
        charisma: req.body.charisma
    };

    const validation = Joi.validate(newCharSheet, charSheetJoiSchema);
    if(validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({error: validation.error});
    }
    CharSheet.findByIdAndUpdate(req.params.charSheetId, charSheetUpdate)
        .then(()=>{
            return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

//REMOVE CHARACTER SHEET BY ID
charSheetRouter.delete('/:charSheetId', jwtPassportMiddleware, (req, res )=>{
    CharSheet.findByIdAndDelete(req.params.charSheetId)
    .then(()=>{
        return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(error => {
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
});

module.exports = { charSheetRouter }