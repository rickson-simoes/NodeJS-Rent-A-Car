import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("Create car", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it("Should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "name car",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    expect(car).toHaveProperty("id");
  });

  it("Should not be able to create a car with the same license_plate", () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: "Car 1",
        description: "description car",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "Category",
      });

      await createCarUseCase.execute({
        name: "Car 2",
        description: "description car 2",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand 2",
        category_id: "Category 2",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to create a car returning available true as default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car available",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABCD-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    expect(car.available).toBe(true);
  });
});
