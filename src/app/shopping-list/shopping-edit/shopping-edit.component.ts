import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm: NgForm;
  editingSubscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient;
  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.editingSubscription = this.shoppingService.startedEditing.subscribe(
      (id: number) => {
        this.editMode = true;
        this.editItemIndex = id;
        this.editItem = this.shoppingService.getIngredient(id);
        this.editForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.editingSubscription.unsubscribe();
  }

  onClear() {
    this.editForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }

  onSubmit(editForm: NgForm) {
    const values = editForm.value;
    if (!this.editMode) {
      this.shoppingService.addIngredient(
        new Ingredient(values.name, values.amount)
      );
    } else {
      this.shoppingService.updateIngredient(
        this.editItemIndex,
        new Ingredient(values.name, values.amount)
      );
    }
    this.editMode = false;
    editForm.reset();
  }
}
