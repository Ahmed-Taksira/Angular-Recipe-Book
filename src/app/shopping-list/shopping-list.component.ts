import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingredsChanged: Subscription;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients();
    this.ingredsChanged = this.shoppingService.ingredientsChanged.subscribe(
      (ingreds: Ingredient[]) => {
        this.ingredients = ingreds;
      }
    );
  }

  ngOnDestroy(): void {
    this.ingredsChanged.unsubscribe();
  }

  onEditItem(id: number) {
    this.shoppingService.startedEditing.next(id);
  }
}
