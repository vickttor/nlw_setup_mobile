import { View, Text, ScrollView } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import {generateRangeDatesFromYearStart} from "../utils/generate-range-between-dates"

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesfromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDateSizes = 18 * 7;
const amountOfDaysToFill = minimumSummaryDateSizes - datesfromYearStart.length;

export function Home(){
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      {/* HEADER */}
      <Header/>
    
      {/* DAY OF THE WEEK */}
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index)=> {
          return (
            <Text 
              key={`${weekDay}-${index}`} 
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{width: DAY_SIZE}}
            >
              {weekDay}
            </Text>
          )
        })}
      </View>

      {/* DAYS */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{paddingBottom: 100}}
      >
        <View className="flex-row flex-wrap">
          { 
            datesfromYearStart.map((date)=> {
            return (
              <HabitDay
                key={date.toISOString()}
              />
            )
            })
          }

          { 
            amountOfDaysToFill > 0 && Array.from({length: amountOfDaysToFill})
              .map((_, index)=> {
                return (
                  <View 
                    key={index}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40" 
                    style={{width: DAY_SIZE, height: DAY_SIZE}}
                  />
                )
                
              })
          }
        </View>
      </ScrollView>
    </View>
  )
}