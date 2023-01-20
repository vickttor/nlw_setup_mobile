import { useNavigation } from "@react-navigation/native";
import { useState, useEffect} from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesfromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDateSizes = 18 * 7;
const amountOfDaysToFill = minimumSummaryDateSizes - datesfromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>

export function Home(){
  const [summary, setSummary] = useState<Summary>([]);
  const [loading, setLoading] = useState(true);

  const {navigate} = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);  
      const response = await api.get('summary');
      setSummary(response.data);
    } catch (error) {
      Alert.alert('Ops', 'Não foi possíveil carregar o sumário de hábitos!')
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    fetchData();
  }, []);

  if(loading) {
    return <Loading/>
  }

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

              const dayWithHabits = summary.find(day=>{
                return dayjs(date).isSame(day.date, 'day');
              })

            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amount={dayWithHabits?.amount}
                completed={dayWithHabits?.completed}
                onPress={()=> navigate("habit", {date: date.toISOString()})}
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