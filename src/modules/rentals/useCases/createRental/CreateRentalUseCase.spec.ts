import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "brand test",
      category_id: "123",
      daily_rate: 100,
      description: "car test",
      fine_amount: 40,
      name: "name test",
      license_plate: "LSJ-0023",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there's one already open to the user", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "111111",
      expected_return_date: dayAdd24Hours,
      user_id: "123",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "1212125",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(
      new AppError("There's already a rental in progress for this user!")
    );
  });

  it("should not be able to create a new rental if there's one already open to the same car", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "brand test",
      category_id: "123",
      daily_rate: 100,
      description: "car test",
      fine_amount: 40,
      name: "name test",
      license_plate: "LSJ-0023",
    });

    await createRentalUseCase.execute({
      user_id: "1234",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable."));
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "1234",
        car_id: "121212",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(
      new AppError("Invalid return time! Minimum duration time: 24 hours")
    );
  });
});
