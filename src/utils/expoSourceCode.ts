export const EXPO_PACKAGE_JSON = `{
  "name": "salarycycle-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-linear-gradient": "~14.0.1",
    "expo-haptics": "~14.0.0",
    "@expo/vector-icons": "^14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.2",
    "react-native-safe-area-context": "4.12.0",
    "react-native-svg": "15.8.0",
    "react-native-google-mobile-ads": "^14.0.0",
    "@react-native-async-storage/async-storage": "1.23.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0"
  },
  "private": true
}`;

export const EXPO_APP_JS = `import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// SalaryCycle - React Native Expo Edition
// Tracks salary, expenses, bills, and remaining funds until payday
export default function App() {
  const [salary, setSalary] = useState(3850);
  const [currentTab, setCurrentTab] = useState('home'); // home, expenses, bills, pro
  const [isPro, setIsPro] = useState(false);

  const [expenses, setExpenses] = useState([
    { id: '1', title: "Trader Joe's Groceries", amount: 142.50, category: 'Groceries' },
    { id: '2', title: 'Team Dinner', amount: 68.00, category: 'Dining' },
    { id: '3', title: 'Gas Refill', amount: 48.00, category: 'Transport' },
  ]);

  const [bills, setBills] = useState([
    { id: 'b1', title: 'Apartment Rent', amount: 1200, isPaid: true, dueDate: '2026-10-02' },
    { id: 'b2', title: 'Fiber Internet', amount: 65, isPaid: false, dueDate: '2026-10-24' },
    { id: 'b3', title: 'City Electric Utility', amount: 110, isPaid: false, dueDate: '2026-10-27' },
    { id: 'b4', title: 'Car Insurance', amount: 135, isPaid: false, dueDate: '2026-10-29' },
  ]);

  // Financial calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const paidBills = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const pendingBills = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  
  const nominalRemaining = salary - totalSpent - paidBills;
  const safeToSpend = nominalRemaining - pendingBills;
  const daysLeft = 10;
  const dailySafe = Math.max(0, safeToSpend / Math.max(1, daysLeft));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />

      {/* Top Mobile App Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>SalaryCycle ⚡</Text>
          <Text style={styles.subHeader}>Cycle Oct 1 - Oct 31 • Day 21 of 31</Text>
        </View>
        <TouchableOpacity
          style={[styles.proBadge, isPro && styles.proActiveBadge]}
          onPress={() => setIsPro(!isPro)}
        >
          <Text style={styles.proText}>{isPro ? 'PRO UNLOCKED' : 'GO PRO'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Payday Countdown Card */}
        <View style={styles.heroCard}>
          <View style={styles.countdownRow}>
            <View>
              <Text style={styles.cardLabel}>TIME UNTIL PAYDAY</Text>
              <Text style={styles.heroDays}>{daysLeft} DAYS</Text>
              <Text style={styles.nextDate}>Next: Oct 31, 2026</Text>
            </View>
            <View style={styles.ringMock}>
              <Text style={styles.ringText}>68%</Text>
              <Text style={styles.ringSub}>Cycle</Text>
            </View>
          </View>

          {/* Daily Safe to Spend highlight */}
          <View style={styles.safeHighlight}>
            <Text style={styles.safeLabel}>DAILY SAFE-TO-SPEND</Text>
            <Text style={styles.safeAmount}>\${dailySafe.toFixed(2)} / day</Text>
            <Text style={styles.safeCaption}>Safe budget after reserving for remaining bills</Text>
          </View>

          {/* Breakdown numbers */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Safe Remaining</Text>
              <Text style={styles.statValGreen}>\${safeToSpend.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pending Bills</Text>
              <Text style={styles.statValAmber}>-\${pendingBills.toFixed(2)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Spent So Far</Text>
              <Text style={styles.statValWhite}>\${totalSpent.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Ad Banner (Monetization - Free tier) */}
        {!isPro && (
          <View style={styles.adBanner}>
            <View style={styles.adContent}>
              <Text style={styles.adBadge}>AD</Text>
              <Text style={styles.adTitle}>Chime • Get paid up to 2 days early!</Text>
            </View>
            <TouchableOpacity onPress={() => setIsPro(true)}>
              <Text style={styles.adRemoveBtn}>Remove Ads</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pending Bills Alert */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Bills Before Payday</Text>
          <Text style={styles.billReservePill}>Reserved: \${pendingBills}</Text>
        </View>

        {bills.filter(b => !b.isPaid).map(bill => (
          <View key={bill.id} style={styles.billItem}>
            <View>
              <Text style={styles.billTitle}>{bill.title}</Text>
              <Text style={styles.billDate}>Due: {bill.dueDate}</Text>
            </View>
            <Text style={styles.billAmount}>\${bill.amount.toFixed(2)}</Text>
          </View>
        ))}

        {/* Recent Expenses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Cycle Spending</Text>
        </View>
        {expenses.map(exp => (
          <View key={exp.id} style={styles.expItem}>
            <View>
              <Text style={styles.expTitle}>{exp.title}</Text>
              <Text style={styles.expCat}>{exp.category}</Text>
            </View>
            <Text style={styles.expAmount}>-\${exp.amount.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Mobile Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('home')}>
          <Ionicons name="wallet-outline" size={22} color={currentTab === 'home' ? '#10b981' : '#64748b'} />
          <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabActive]}>Cycle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('expenses')}>
          <Ionicons name="card-outline" size={22} color={currentTab === 'expenses' ? '#10b981' : '#64748b'} />
          <Text style={[styles.tabLabel, currentTab === 'expenses' && styles.tabActive]}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('bills')}>
          <Ionicons name="receipt-outline" size={22} color={currentTab === 'bills' ? '#10b981' : '#64748b'} />
          <Text style={[styles.tabLabel, currentTab === 'bills' && styles.tabActive]}>Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('pro')}>
          <Ionicons name="cloud-upload-outline" size={22} color={currentTab === 'pro' ? '#10b981' : '#64748b'} />
          <Text style={[styles.tabLabel, currentTab === 'pro' && styles.tabActive]}>Cloud / Pro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  appName: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  subHeader: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  proBadge: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  proActiveBadge: { backgroundColor: '#10b981', borderColor: '#059669' },
  proText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 16 },
  heroCard: { backgroundColor: '#111827', borderRadius: 20, padding: 18, marginTop: 12, borderWidth: 1, borderColor: '#1f2937' },
  countdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  heroDays: { color: '#38bdf8', fontSize: 32, fontWeight: '900', marginTop: 2 },
  nextDate: { color: '#64748b', fontSize: 12, marginTop: 2 },
  ringMock: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: '#10b981', justifyContent: 'center', alignItems: 'center' },
  ringText: { color: '#10b981', fontWeight: '800', fontSize: 15 },
  ringSub: { color: '#64748b', fontSize: 9 },
  safeHighlight: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginTop: 16 },
  safeLabel: { color: '#a7f3d0', fontSize: 11, fontWeight: '700' },
  safeAmount: { color: '#34d399', fontSize: 26, fontWeight: '800', marginTop: 2 },
  safeCaption: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderColor: '#1f2937' },
  statBox: { flex: 1 },
  statLabel: { color: '#64748b', fontSize: 10, textTransform: 'uppercase' },
  statValGreen: { color: '#10b981', fontSize: 16, fontWeight: '700', marginTop: 2 },
  statValAmber: { color: '#f59e0b', fontSize: 16, fontWeight: '700', marginTop: 2 },
  statValWhite: { color: '#e2e8f0', fontSize: 16, fontWeight: '700', marginTop: 2 },
  adBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#182234', borderRadius: 12, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#2e3d54' },
  adContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  adBadge: { backgroundColor: '#f59e0b', color: '#000', fontSize: 9, fontWeight: '800', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  adTitle: { color: '#cbd5e1', fontSize: 11, fontWeight: '500' },
  adRemoveBtn: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginLeft: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
  sectionTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: '700' },
  billReservePill: { color: '#fbbf24', fontSize: 11, backgroundColor: '#78350f44', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  billItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#1f2937' },
  billTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
  billDate: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  billAmount: { color: '#f87171', fontSize: 14, fontWeight: '700' },
  expItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#1f2937' },
  expTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
  expCat: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  expAmount: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, flexDirection: 'row', backgroundColor: '#0f172a', borderTopWidth: 1, borderColor: '#1e293b', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  tabItem: { alignItems: 'center' },
  tabLabel: { color: '#64748b', fontSize: 10, marginTop: 3 },
  tabActive: { color: '#10b981', fontWeight: '700' }
});
`;
