/*****************************************************/
/*
DO NOT EDIT CODE BETWEEN THIS LINE AND LINE 218. It will likely break the simulation!
Code below is licensed according to the MIT license. See the details below.
Code written by Evan Weinberg, Advanced Automation @ Saigon South International School, September 2021
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
class Cup {

    volume: number
    temperature: number
    coffeeGrounds: number
    sodaMix: number
    isCarbonated: boolean
    descriptionString: string
    constructor() {
        this.volume = 0
        this.temperature = 0
        this.coffeeGrounds = 0
        this.sodaMix = 0
        this.isCarbonated = false
        this.descriptionString = "empty cup"
    }

}

class DrinkMachine {

    reservoirVolume: number
    private reservoirTemperature: number
    amountOfGroundsStored: number
    amountOfSodaMixStored: number
    mixingContainerVolume: number
    mixingContainerTemperature: number
    groundsInMixingContainer: number
    sodaMixInMixingContainer: number
    completedDrink: Cup

    private loopCount: number; //the current number of loops for the DrinkMachine
    mixingHeaterOn: boolean; //whether or not the LED for the timer is on or not
    mixingCoolerOn: boolean; //mixing cooler is turned on
    mixingContainerCarbonated: boolean
    fillingMixingContainer: boolean //valve is open

    private RESERVOIR_FLOW_RATE_PER_LOOP = .785
    private MIXING_CONTAINER_MAX_VOLUME = 500
    private GROUNDS_PER_SCOOP = 0.175 //updated 18 August
    private SODA_MIX_PER_SCOOP = 0.195 //updated 18 August
    private HEATER_POWER = 200
    private COOLER_POWER = -170.97756



    constructor() {
        this.reservoirVolume = 5000
        this.reservoirTemperature = 24.0
        this.amountOfGroundsStored = 100.0
        this.amountOfSodaMixStored = 100.0
        this.mixingContainerVolume = 0.5
        this.mixingContainerTemperature = 24.0
        this.groundsInMixingContainer = 0.0
        this.sodaMixInMixingContainer = 0.0
        this.mixingHeaterOn = false
        this.mixingCoolerOn = false //updated 18 August
        this.fillingMixingContainer = false
        this.mixingContainerCarbonated = false
        this.completedDrink = new Cup()
        this.loopCount = 0;
    };


    updateMachineStatus() {

        this.loopCount += 1;

        this.updateReservoirVolume();
        this.updateMixingContainerTemperature();


    };
    private updateReservoirVolume() {



        if (this.reservoirVolume > 0 && this.fillingMixingContainer) {
            if (this.mixingContainerVolume <= this.MIXING_CONTAINER_MAX_VOLUME)
                this.reservoirVolume -= this.RESERVOIR_FLOW_RATE_PER_LOOP
            this.mixingContainerVolume += this.RESERVOIR_FLOW_RATE_PER_LOOP

        }

    }
    addGrounds() {

        if (this.amountOfGroundsStored > 0) {

            this.amountOfGroundsStored -= this.GROUNDS_PER_SCOOP
            this.groundsInMixingContainer += this.GROUNDS_PER_SCOOP

        }

    }
    addSodaMix() {

        if (this.amountOfSodaMixStored > 0) { //updated 18 August

            this.amountOfSodaMixStored -= this.SODA_MIX_PER_SCOOP //updated 18 August
            this.sodaMixInMixingContainer += this.SODA_MIX_PER_SCOOP //updated 18 August

        }

    }

    carbonateMixingContainer() {

        this.mixingContainerCarbonated = true

    }

    dispenseDrinkFromMixingContainer() {

        this.completedDrink.volume = this.mixingContainerVolume
        this.completedDrink.temperature = this.mixingContainerTemperature
        this.completedDrink.coffeeGrounds = this.groundsInMixingContainer
        this.completedDrink.sodaMix = this.sodaMixInMixingContainer
        this.completedDrink.isCarbonated = this.mixingContainerCarbonated

        let carbonatedString = (this.completedDrink.isCarbonated ? "is " : "is not ")
        this.completedDrink.descriptionString = this.completedDrink.volume + " mL in cup, " + this.completedDrink.temperature + " ˚C, " + this.completedDrink.coffeeGrounds + " grams coffee, " + this.completedDrink.sodaMix + " grams soda mix, " + carbonatedString + "carbonated"

        let dispensedDrink = this.completedDrink

        this.mixingContainerVolume = 0
        this.completedDrink = new Cup()
        this.mixingContainerCarbonated = false
        return dispensedDrink
    }

    wait(timeInMilliseconds: number) {
        const TIME_SCALE_FACTOR = 5
        let waitCount = 0
        while (waitCount < (timeInMilliseconds / TIME_SCALE_FACTOR)) {
            this.updateMachineStatus()
            waitCount += 1
            basic.pause(1)
        }


    }

    turnHeaterOn() {
        this.mixingHeaterOn = true
    }

    turnHeaterOff() {
        this.mixingHeaterOn = false
    }

    turnCoolerOn() {
        this.mixingCoolerOn = true
    }

    turnCoolerOff() {
        this.mixingCoolerOn = false
    }

    startFillingContainer() {
        this.fillingMixingContainer = true
    }

    stopFillingContainer() {
        this.fillingMixingContainer = false
    }

    getTemperature() {
        return this.mixingContainerTemperature
    }

    getVolume() {
        return this.mixingContainerVolume
    }

    getGrounds() {
        return this.groundsInMixingContainer
    }

    getSodaMix() {
        return this.sodaMixInMixingContainer
    }

    private updateMixingContainerTemperature() {
        if (this.mixingHeaterOn) {
            let deltaTemperature = this.HEATER_POWER / (this.mixingContainerVolume * 100)
            this.mixingContainerTemperature += deltaTemperature
        }
        if (this.mixingCoolerOn) {
            let deltaTemperature = this.COOLER_POWER / (this.mixingContainerVolume * 100)
            this.mixingContainerTemperature += deltaTemperature
        }

    }




}

let myDrinkMachine = new DrinkMachine()

function fillCup() {


    let filledCup = myDrinkMachine.dispenseDrinkFromMixingContainer()

    return filledCup

}

//END OF SIMULATOR CODE

//Add your own code below.


input.onButtonPressed(Button.A, function () {

    serial.writeLine("I start to make Soda")

    function makeSodaCup(volume: number) {
        serial.writeLine(myDrinkMachine.getVolume().toString())
        myDrinkMachine.startFillingContainer()
        serial.writeLine("I am filling the Container")
        while (myDrinkMachine.getVolume() < volume) {
            myDrinkMachine.wait(1)
        }
        myDrinkMachine.stopFillingContainer()
        serial.writeLine("I am done filling the Container")
        while (myDrinkMachine.sodaMixInMixingContainer < 35) {
            myDrinkMachine.addSodaMix()

        }
        serial.writeLine("I added the SodaMix")
        myDrinkMachine.turnCoolerOn()
        serial.writeLine("I am cooling the Water")
        while (myDrinkMachine.getTemperature() > 9) {
            myDrinkMachine.wait(1)
        }
        myDrinkMachine.turnCoolerOff()
        serial.writeLine("I cooled the water")

        serial.writeLine(myDrinkMachine.getTemperature().toString())
        myDrinkMachine.carbonateMixingContainer()
        let filledCup = fillCup()
        serial.writeLine(filledCup.descriptionString)
        let concentration = filledCup.sodaMix / filledCup.volume
        serial.writeLine(concentration.toString())
    }
    makeSodaCup(350)
}
)



// function makeCoffeeCup(volume: number) {
//     serial.writeLine(myDrinkMachine.getVolume().toString())
//     myDrinkMachine.startFillingContainer()
//     while (myDrinkMachine.getVolume() < volume) {
//         myDrinkMachine.wait(1)
//     }
//     myDrinkMachine.stopFillingContainer()
//     myDrinkMachine.turnHeaterOn()
//     myDrinkMachine.wait(35000)
//     serial.writeLine(myDrinkMachine.getTemperature().toString())

//     while (myDrinkMachine.groundsInMixingContainer < 15) {
//         myDrinkMachine.addGrounds()
//     }

//     let filledCup = fillCup()
//     serial.writeLine(filledCup.descriptionString)
//     let concentration = filledCup.coffeeGrounds / filledCup.volume
//     serial.writeLine(concentration.toString())
// }


// input.onButtonPressed(Button.B, function () {
//     makeCoffeeCup(200)
// }

input.onButtonPressed(Button.B, function () {

    serial.writeLine("I start to make SparkingWater")

    function makeSparklingWater(volume: number) {
        serial.writeLine(myDrinkMachine.getVolume().toString())
        myDrinkMachine.startFillingContainer()
        serial.writeLine("I am filling the Container")
        while (myDrinkMachine.getVolume() < volume) {
            myDrinkMachine.wait(1)
        }
        myDrinkMachine.stopFillingContainer()
        serial.writeLine("I am done filling the Container")
        myDrinkMachine.turnCoolerOn()
        serial.writeLine("I am cooling the Water")
        while (myDrinkMachine.getTemperature() > 10) {
            myDrinkMachine.wait(1)
        }
        myDrinkMachine.turnCoolerOff()
        serial.writeLine("I cooled the water")
        serial.writeLine(myDrinkMachine.getTemperature().toString())
        myDrinkMachine.carbonateMixingContainer()
        let filledCup = fillCup()
        serial.writeLine(filledCup.descriptionString)
    }

    makeSparklingWater(350)

}
)


