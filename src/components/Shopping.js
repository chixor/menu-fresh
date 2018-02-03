import React, { Component } from 'react';
import api from '../utils/api';
import MenuDate from '../utils/MenuDate';
import { NotificationManager } from 'react-notifications';

export default class Shopping extends Component {
    constructor(props) {
        super();
        this.state = {
            ingredients: [],
            cost: 0
        }
        this.firstDay = new MenuDate().toFirstDayOfTheWeek();
        this.lastDay = new MenuDate().toLastDayOfTheWeek();
        this.datestamp = {
          week: this.firstDay.getDateWeek(),
          year: this.firstDay.getFullYear()
        };
    }

    componentDidMount() {
      if(this.props.match.params && this.props.match.params.year) {
        this.firstDay = new MenuDate(this.props.match.params.year,0,(1 + (parseInt(this.props.match.params.week) - 1) * 7)).toFirstDayOfTheWeek();
        this.lastDay = new MenuDate(this.props.match.params.year,0,(1 + (parseInt(this.props.match.params.week) - 1) * 7)).toLastDayOfTheWeek();
        this.datestamp = {
          week: this.props.match.params.week,
          year: this.props.match.params.year
        };
      }

      api.shoppingListWeek(this.datestamp).then((ingredients) => {
          var cost = ingredients.fresh.reduce((a, b) => { return b.cost ? {cost: a.cost + b.cost} : {cost: a.cost}});
          this.setState({ ingredients, cost: cost.cost });
      });
    }

    reset = () => {
      api.resetShoppingList(this.datestamp).then(() => {
        window.location.reload();
      });
    }

    save = () => {
      api.saveShoppingList(
        this.datestamp,
        this.state.ingredients.fresh.concat(this.state.ingredients.pantry)
      );
    }

    dragStart = (ingredient, fromList, fromIndex) => {
      this.setState({ drag: { ingredient, fromList, fromIndex } });
    }

    dragOverTable = (e) => {
      e.preventDefault();
    }

    dragEnterRow = (toList, toIndex) => {
      var drag = this.state.drag;
      drag.toIndex = toIndex;
      drag.toList = toList;

      var ingredients = this.state.ingredients;
      ['fresh','pantry'].forEach((i) => {ingredients[i].map((r) => {r.dragover = false})});
      ingredients[toList][toIndex].dragover = true;

      this.setState({ ingredients, drag });
    }

    drop = () => {
      var ingredients = this.state.ingredients, drag = this.state.drag, cost;
      ['fresh','pantry'].forEach((i) => {ingredients[i].map((r) => {r.dragover = false})});

      if(!drag.ingredient.recipeIngredient_id && drag.toList === 'pantry') {
        this.setState({ drag: undefined });
        NotificationManager.warning('Cannot save that to the pantry');
        this.setState({ ingredients });
        return;
      }

      drag.ingredient.fresh = (drag.toList === 'fresh');
      ingredients[drag.fromList].splice(drag.fromIndex, 1);
      drag.toIndex = (drag.toList === drag.fromList && drag.toIndex < drag.fromIndex || drag.toList !== drag.fromList) ?
        drag.toIndex + 1: drag.toIndex;

      ingredients[drag.toList].splice(drag.toIndex, 0, drag.ingredient);
      cost = ingredients.fresh.reduce((a, b) => ({cost: a.cost + b.cost}));
      this.setState({ ingredients, cost: cost.cost, drag: undefined }, this.save);
    }

    add = (e) => {
      e.stopPropagation();
      e.preventDefault();

      api.addShoppingListItem(
        this.datestamp,
        this.refs.newIngredient.value,
        this.state.ingredients.fresh.length
      ).then((id) => {
        if(!id) return;
        var ingredients = this.state.ingredients;
        ingredients.fresh.push({id: id, fresh: true, ingredient: this.refs.newIngredient.value, purchased: false});
        this.refs.newIngredient.value = '';
        this.setState({ ingredients });
      });
    }

    delete = (index) => {
      var id = this.state.ingredients.fresh[index].id;
      api.deleteShoppingListItem(this.datestamp, id).then(() => {
        var ingredients = this.state.ingredients;
        ingredients.fresh.splice(index, 1);
        this.setState({ ingredients });
      });
    }

    purchase = (index) => {
      var purchased = !this.state.ingredients.fresh[index].purchased;
      api.purchaseShoppingListItem(
        this.datestamp,
        this.state.ingredients.fresh[index].id,
        purchased
      ).then(() => {
        var ingredients = this.state.ingredients;
        ingredients.fresh[index].purchased = purchased;
        this.setState({ ingredients });
      });
    }

    render() {
        return (
            <div>
                <div className="row">
                <div className="col-md-12">
                    <h2 className="shopping-week">
                      Week {this.datestamp.week} - {this.firstDay.formatText()} to {this.lastDay.formatText()}
                      <button className="btn btn-default float-right" onClick={() => this.reset()}><span className="glyphicon glyphicon-refresh"></span> Reset</button>
                    </h2>
                </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="recipedetail">
                          <h3>
                            Shopping List
                            <span className="float-right">{this.state.cost && this.state.cost.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</span>
                          </h3>
                          <table className="table" onDrop={this.drop} onDragOver={this.dragOverTable}>
                              <tbody>
                                  <tr>
                                      <th colSpan="2">Ingredients</th>
                                      <th className="ingredient-quantity">2p</th>
                                      <th className="ingredient-quantity">4p</th>
                                      <th className="ingredient-price">Price</th>
                                  </tr>
                                  {this.state.ingredients.fresh && this.state.ingredients.fresh.map((r, i) => {
                                    return <tr
                                        className={`${r.purchased ? 'checked' : ''} ${r.dragover ? 'dragover' : ''}`}
                                        draggable="true"
                                        onDragStart={() => this.dragStart(r,'fresh',i)}
                                        onDragEnter={() => this.dragEnterRow('fresh',i)}
                                        key={`ingredient-${r.ingredient}-${r.recipeIngredient_id}`}
                                      >
                                          <td className={`supermarket-category supermarket-category-${r.category ? r.category.replace(' & ','').replace(' ','-'): ''}`}><input onChange={() => this.purchase(i)} type="checkbox" checked={r.purchased}/></td>
                                          <td>{r.ingredient}</td>
                                          <td>{r.quantity} {r.quantityMeasure}{parseFloat(r.quantity) > 1 ? 's':null}</td>
                                          <td>{r.quantity4} {r.quantityMeasure}{parseFloat(r.quantity4) > 1 ? 's':null}</td>
                                          {r.recipeIngredient_id ?
                                            <td className="align-right">{r.cost && r.cost.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}</td>:
                                            <td className="align-right"><span onClick={() => this.delete(i)} className="glyphicon glyphicon-remove"></span></td>}
                                      </tr>
                                  })}
                                  <tr><td colSpan="5"><form onSubmit={this.add}><input type="text" className="ingredient-input" placeholder="add item..." ref="newIngredient" name="newIngredient"/></form></td></tr>
                              </tbody>
                          </table>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="recipedetail">
                          <h3>Pantry</h3>
                          <table className="table" onDrop={this.drop} onDragOver={this.dragOverTable}>
                              <tbody>
                                  <tr>
                                      <th>Ingredients</th>
                                      <th className="ingredient-quantity">2p</th>
                                      <th className="ingredient-quantity">4p</th>
                                  </tr>
                                  {this.state.ingredients.pantry && this.state.ingredients.pantry.map((r, i) => {
                                    return <tr
                                        className={r.dragover ? 'dragover' : ''}
                                        draggable="true"
                                        onDragStart={() => this.dragStart(r,'pantry',i)}
                                        onDragEnter={() => this.dragEnterRow('pantry',i)}
                                        key={`ingredient-${r.ingredient}-${r.recipeIngredient_id}`}>
                                          <td>{r.ingredient}</td>
                                          <td>{r.quantity} {r.quantityMeasure}{parseFloat(r.quantity) > 1 ? 's':null}</td>
                                          <td>{r.quantity4} {r.quantityMeasure}{parseFloat(r.quantity4) > 1 ? 's':null}</td>
                                      </tr>
                                  })}
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
                <br/><br/>
            </div>
        )
    }
}
