import { MoveAction, ShootAction, SaveAction, SwitchWeaponAction, BladeRotateAction, Weapon } from '../core/action.js';
import { Consts } from '../core/constants.js';
/**
 * (fr) Cette classe représente votre bot. Vous pouvez y définir des attributs et des méthodes qui
 *      seront conservées entre chaque appel de la méthode `on_tick`.
 * 
 * (en) This class represents your bot. You can define attributes and methods in it that will be kept 
 *      between each call of the `on_tick` method.
 */
//4f352783-52b0-4893-8a7e-6ea35db45830
class MyBot {
    constructor() {
        this.name = 'EarthIsFlat';
        this.state = null;
        this.currentWeapon = null;
        this.currentEnemy = null;
        this.position = null;
        this.tick = null;
    }
    /**
     * (fr) Cette méthode est appelée à chaque tick de jeu. Vous pouvez y définir 
     *      le comportement de voter bot. Elle doit retourner une liste d'actions 
     *      qui sera exécutée par le serveur.
     *  
     *      Liste des actions possibles:
     *      - MoveAction({x, y})        Permet de diriger son bot, il ira a vitesse
     *                                  constante jusqu'à ce point.
     * 
     *      - ShootAction({x, y})       Si vous avez le canon comme arme, cela va tirer
     *                                  à la coordonnée donnée.
     * 
     *      - SaveAction([...])         Permet de storer 100 octets dans le serveur. Lors
     *                                  de votre reconnection, ces données vous seront
     *                                  redonnées par le serveur.
     * 
     *      - SwitchWeaponAction(id)    Permet de changer d'arme. Par défaut, votre bot
     *                                  n'est pas armé, voici vos choix:
     *                                      Weapon.None
     *                                      Weapon.Gun
     *                                      Weapon.Blade
     *   
     *      - BladeRotateAction(rad)    Si vous avez la lame comme arme, vous pouver mettre votre arme
     *                                  à la rotation donnée en radian.
     *
     * 
     * (en) This method is called at every game tick. You can define the behavior
     *      of your bot here. It must return a list of actions that will be executed 
     *      by the server.
     * 
     *      List of possible actions:
     *      - MoveAction({x, y})        allows you to direct your bot, it will move at a 
     *                                  constant speed to this point.
     * 
     *      - ShootAction({x, y})       if you have the cannon as a weapon, it will shoot 
     *                                  at the given coordinate.
     * 
     *      - SaveAction([...])         allows you to store 100 bytes on the server. Upon 
     *                                  reconnection, these data will be returned to you 
     *                                  by the server.
     * 
     *      - SwitchWeaponAction(id)    allows you to change weapons. By default, your bot
     *                                  is not armed. Here are your choices:
     *                                      Weapon.None
     *                                      Weapon.Gun
     *                                      Weapon.Blade
     * 
     *      - BladeRotateAction(rad)    if you have the blade as a weapon, you can set your
     *                                  weapon to the given rotation in radians.
     * 
     * @param {Model.GameState} game_state 
     * @returns{Model.Actions}
     */

    on_tick(game_state) {
        if (this.tick === null) {
            this.tick = game_state.tick;
        }
    
        var us = null;
        for (let i = 0; i < game_state.players.length; i++) {
            if (game_state.players[i].name === this.name) {
                us = game_state.players[i];
                break;
            }
        }
    
        var newPosition = { x: us.pos.x / 30, y: us.pos.y / 30 };
        let actionList = [];
    
        if (this.currentWeapon === null) {
            actionList.push(new SwitchWeaponAction(1));
            this.currentWeapon = true;
        }
    
        // Filter out the bot itself from the players list and sort remaining players by distance to the bot
        var sortedPlayers = game_state.players
            .filter(player => player.name !== this.name)
            .sort((a, b) => {
                var aDist = Math.sqrt((newPosition.x - a.pos.x / 30) ** 2 + (newPosition.y - a.pos.y / 30) ** 2);
                var bDist = Math.sqrt((newPosition.x - b.pos.x / 30) ** 2 + (newPosition.y - b.pos.y / 30) ** 2);
                return aDist - bDist;
            });
    
        // Choose the nearest player as the current enemy
        this.currentEnemy = sortedPlayers[0];
    
        // Update currentEnemy if it's not null
        if (this.currentEnemy !== null) {
            for (let i = 0; i < game_state.players.length; i++) {
                if (game_state.players[i].name === this.currentEnemy.name) {
                    this.currentEnemy = game_state.players[i];
                    break;
                }
            }
        } else {
            this.currentEnemy = sortedPlayers[0];
        }
    
        // Add actions to the action list
        actionList.push(new ShootAction({ x: this.currentEnemy.pos.x / 30 + 0.5, y: this.currentEnemy.pos.y / 30 + 0.5 }));
        actionList.push(new MoveAction({ x: this.currentEnemy.pos.x / 30, y: this.currentEnemy.pos.y / 30 }));
    
        this.position = newPosition;
    
        return actionList;
    }
    
    


    /**
     * (fr) Cette méthode est appelée une seule fois au début de la partie. Vous pouvez y définir des
     *      actions à effectuer au début de la partie.
     * 
     * (en) This method is called once at the beginning of the game. You can define actions to be 
     *      performed at the beginning of the game.
     * 
     * @param {Model.MapState} state (fr) L'état de la carte
     *                               (en) The state of the map.
     * @returns None
     */
    on_start(state) {
        this.state = state;
    }


    /**
     * (fr) Cette méthode est appelée une seule fois à la fin de la partie. Vous pouvez y définir des actions
     *      à effectuer à la fin de la partie.
     * 
     * (en) This method is called once at the end of the game. You can define actions to be performed 
     *      at the end of the game.
     * 
     * @returns None
     */
    on_end() {
        this.currentEnemy = null;
    }

    find_closest_player(){


    }
};

export { MyBot };