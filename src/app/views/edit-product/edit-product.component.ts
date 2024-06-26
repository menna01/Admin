import { Component, OnInit } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  //editProductForm: FormGroup;
  ID = 1;
  Name = '';
  Price = 0;
  Sale = 0;
  Quantity = 0;
  Description = '';
  Category = '';
  inStock = '';
  Image: any;
  product: any;
  changePhoto = false;
  choosen = false;
  submitted = false;
  image: any;
  editProductForm: FormGroup;
  categories: any[]=[];

  constructor(
    public fb: FormBuilder,
    myActivated: ActivatedRoute,
    private myService: AdminService,
    private router: Router
  ) {
    this.ID = myActivated.snapshot.params['_id'];
    this.editProductForm = this.fb.group({
      name: new FormControl('Name', [
        Validators.required,
        Validators.minLength(3),
      ]),
      price: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
      ]),
      sale: 0,
      quantity: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]+?$'),
      ]),
      description: [''],
      category: new FormControl('', [Validators.required]),
      productImage: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.myService.getProductByID(this.ID).subscribe({
      next: (res: any) => {
        console.log(res);
        // console.log(res.inStock)
        this.product = res;
        this.Name = res.name;
        this.Price = res.price;
        this.Sale = res.sale;
        this.Quantity = res.quantity;
        this.Description = res.description;
        this.Category = res.categoryName;
        this.Image = res.imgURL;
      },
      error(err) {
        console.log(err);
      },
    });

    this.myService.getCategories().subscribe({
      next: (res: any) => {
        // console.log(res)
        this.categories = res;
        console.log(this.categories);
      },
      error(err) {
        console.log(err);
      },
    });
    this.getSelectedCateory(event);
  }
 
  Edit(
    name: any,
    price: any,
    sale: any,
    quantity: any,
    description: any,
    category: any
  ) {
    // Construct the updated product object
    let product = {
      productId: this.ID, // Assuming this.ID is defined somewhere
      name,
      price,
      sale,
      quantity,
      description,
      categoryId: category,
    };
  
    // Set 'name' to local storage - Verify if this is the intended action
    localStorage.setItem("name", product.name);
  
    // Call the service method to update the product
    this.myService.UpdateProductByID(this.ID, product).subscribe(
      () => {
        // Navigate to the products page after a successful update
        this.router.navigate(['/products']);
      },
      error => {
        // Handle any errors here
        console.error('Error updating product:', error);
        // Optionally, you can add user-friendly error handling or display messages
        // Example: this.errorMessage = 'Failed to update product. Please try again.';
      }
    );
  }
 

  // Edit(
  //   name: any,
  //   price: any,
  //   sale: any,
  //   quantity: any,
  //   description: any,
  //   category: any
  // ) {

  //   //  categoryName = this.categories.find((obj:any) => obj.categoryName == this.Category)?.categoryId;
  //   let product = {
  //     productId: this.ID,
  //     name,
  //     price,
  //     sale,
  //     quantity,
  //     description,
  //     categoryId: category,
  //   };
  //   localStorage.setItem("name",product.name)
  //   // this.myService.UpdateProductByID(this.ID, product).subscribe(() => {
  //   //   this.router.navigate(['/products']);
  //   // });
  //   this.myService.UpdateProductByID(this.ID, product).subscribe(
  //         () => {
  //           // Navigate to the products page after a successful update
  //           this.router.navigate(['/products']);
  //         },
  //         error => {
  //           // Handle any errors here
  //           console.error('Error updating product:', error);
  //         }
  //       );
  //   //  console.log(this.Category);
  // }
  // Edit(
  //   name: any,
  //   price: any,
  //   sale: any,
  //   quantity: any,
  //   description: any,
  //   category: any
  // ) {
  //   // Ensure that 'category' is an ID and doesn't need to be looked up again
  //   let product = {
  //     productId: this.ID,
  //     name,
  //     price,
  //     sale,
  //     quantity,
  //     description,
  //     categoryId: category, // Directly use the categoryId from the selected option
  //   };
  
  //   // Call the service to update the product by ID
  //   this.myService.UpdateProductByID(this.ID, product).subscribe(
  //     () => {
  //       // Navigate to the products page after a successful update
  //       this.router.navigate(['/products']);
  //     },
  //     error => {
  //       // Handle any errors here
  //       console.error('Error updating product:', error);
  //     }
  //   );
  // }
  openFile() {
    document.getElementById('input_file')!.click();
  }
  fileChoosen(event: any) {
    if (event.target.value) {
      this.image = <File>event.target.files[0];
      this.choosen = true;
      this.submitPhoto();
      // document.getElementById('route')!.click();
    }
  }

  submitPhoto() {
    let fd = new FormData();
    this.submitted = true;
    if (this.image) {
      fd.append('Image', this.image, this.image.name);
      this.myService.UpdateProductImage(this.ID, fd).subscribe(() => {
        location.reload();
      });
    }
    console.log(this.image.name);
  }

  getSelectedCateory(event: any) {
    if (event.target.value) {
      this.editProductForm.get('category')!.setValue(event.target.value);
    } else {
      this.editProductForm.get('category')!.setValue(this.Category);
    }

    console.log(this.editProductForm);
  }

  getStock(event: any) {
    this.editProductForm.get('inStock')!.setValue(event.target.value);
    console.log(this.editProductForm);
  }

  onSubmit() {
    if (this.editProductForm.invalid) return;
  }
  get nameValid() {
    return this.editProductForm.controls['name'].valid;
  }

  get priceValid() {
    return this.editProductForm.controls['price'].valid;
  }
  get quantityValid() {
    return this.editProductForm.controls['quantity'].valid;
  }
  get categoryValid() {
    return this.editProductForm.controls['category'].valid;
  }

  get imageValid() {
    return this.editProductForm.controls['productImage'].valid;
  }
}
