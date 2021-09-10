import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsUseCase";

// import { CreateCarUseCase } from "../createCar/CreateCarUseCase";

describe("List cars", () => {
  let listAvailableCarsUseCase: ListAvailableCarsUseCase;
  let carsRepository: CarsRepositoryInMemory;
  // let createCarUseCase: CreateCarUseCase;

  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();

    // createCarUseCase = new CreateCarUseCase(carsRepository);
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("Should be able to list all available cars", async () => {
    // PRIMEIRO JEITO QUE FIZ PARA CONSEGUIR TESTAR A LISTA DE CARROS

    // await createCarUseCase.execute({
    //   name: "name car",
    //   description: "description car",
    //   daily_rate: 100,
    //   license_plate: "ABC-1234",
    //   fine_amount: 60,
    //   brand: "Brand",
    //   category_id: "Category",
    // });

    // await createCarUseCase.execute({
    //   name: "name car 2",
    //   description: "description car 2",
    //   daily_rate: 130,
    //   license_plate: "ABC-1235",
    //   fine_amount: 80,
    //   brand: "Brand 2",
    //   category_id: "Category 2",
    // });

    // const cars = await listAvailableCarsUseCase.execute();

    // expect(cars).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining({ name: "name car" }),
    //     expect.objectContaining({ name: "name car 2" }),
    //   ])
    // );

    const car = await carsRepository.create({
      name: "name car",
      description: "description car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepository.create({
      name: "Car2",
      description: "description car2",
      daily_rate: 100,
      license_plate: "ABC-1235",
      fine_amount: 60,
      brand: "Car_brand_test 2",
      category_id: "Category2",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car_brand_test 2",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      name: "Car3",
      description: "description car 3",
      daily_rate: 100,
      license_plate: "ABC-1236",
      fine_amount: 60,
      brand: "Car_brand_test 3",
      category_id: "Category3",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car3",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category id", async () => {
    const car = await carsRepository.create({
      name: "Car4",
      description: "description car ",
      daily_rate: 100,
      license_plate: "ABC-1237",
      fine_amount: 60,
      brand: "Car_brand_test 4",
      category_id: "Category4",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "Category4",
    });

    expect(cars).toEqual([car]);
  });
});
