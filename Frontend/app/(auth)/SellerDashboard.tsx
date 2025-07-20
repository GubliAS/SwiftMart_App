// SellerDashboardScreen.tsx
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Reusable Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  icon?: string; // Optional icon name for specific cards like rating
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statCardTitle}>{title}</Text>
    <View style={styles.statCardValueContainer}>
      <Text style={styles.statCardValue}>{value}</Text>
      {icon && <Ionicons name={icon as any} size={20} color="#FFD700" style={{ marginLeft: 5 }} />}
    </View>
  </View>
);

// Reusable Quick Action Item Component
interface QuickActionItemProps {
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof FontAwesome5.glyphMap; // Allow different icon sets
  iconColor: string;
  iconBg: string;
  label: string;
  onPress: () => void;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ iconName, iconColor, iconBg, label, onPress, iconType = 'Ionicons' }) => {
  const IconComponent =
    iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
    iconType === 'FontAwesome5' ? FontAwesome5 :
    Ionicons;

  return (
    <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
      <View style={[styles.quickActionIconBg, { backgroundColor: iconBg }]}>
        <IconComponent name={iconName as any} size={24} color={iconColor} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const SellerDashboardScreen: React.FC = () => {
  const router = useRouter();

  const handleLeaveSellerMode = () => {
    // Implement logic to switch back to buyer mode or log out
    console.log("Leaving Seller Mode");
    alert("Leaving Seller Mode");
    // Example: router.replace('/(auth)/login'); or router.back() depending on your stack
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.dashboardText}>Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome back, Claire</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard title="Total Products" value="42" />
          <StatCard title="Pending Orders" value="7" />
          <StatCard title="Sales This Week" value="$1,245" />
          <StatCard title="Store Rating" value="4.8" icon="star" />
        </View>

        {/* Quick Actions Section */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionItem
            iconName="add"
            iconColor="#FFF"
            iconBg="#4CAF50" // Green
            label="Add Product"
            onPress={() => router.push('/AddProductScreen')} // Navigate to AddProductScreen.tsx
          />
          <QuickActionItem
            iconName="briefcase-outline" // Changed to outline for consistency
            iconColor="#FFF"
            iconBg="#2196F3" // Blue
            label="My Products"
            onPress={() => router.push('/MyProducts')} // Navigate to Myproducts.tsx
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="clipboard-list-outline" // Changed to list outline for clarity
            iconColor="#FFF"
            iconBg="#9C27B0" // Purple
            label="Orders"
            onPress={() => router.push('/Orders')} // Navigate to Orders.tsx
            iconType="MaterialCommunityIcons"
          />
          <QuickActionItem
            iconName="cash-outline" // A cash icon
            iconColor="#FFF"
            iconBg="#FFC107" // Amber/Orange
            label="Earnings"
            onPress={() => router.push('/OrderEarnings')} // Navigate to OrderEarnings.tsx
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="settings-outline"
            iconColor="#FFF"
            iconBg="#607D8B" // Blue Grey
            label="Settings"
            onPress={() => console.log('Settings Pressed')} // Placeholder
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="megaphone-outline"
            iconColor="#FFF"
            iconBg="#FF5722" // Deep Orange
            label="Promotions"
            onPress={() => console.log('Promotions Pressed')} // Placeholder
            iconType="Ionicons"
          />
        </View>

        {/* Leave Seller Mode Button */}
        <TouchableOpacity style={styles.leaveSellerModeButton} onPress={handleLeaveSellerMode}>
          <Ionicons name="exit-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.leaveSellerModeButtonText}>Leave Seller Mode</Text>
        </TouchableOpacity>

        {/* Recent Activity Section */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentActivityContainer}>
          {/* Example Recent Activity Item 1 */}
          <View style={styles.activityItem}>
            <View style={styles.activityIconBg}>
              <Ionicons name="bag-handle-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>New order received</Text>
              <Text style={styles.activityInfo}>Order #:SW M93284</Text>
              <Text style={styles.activityInfo}>Total Amount: <Text style={styles.activityAmount}>$274.13</Text></Text>
              <Text style={styles.activityInfo}>Size: 2</Text>
            </View>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>

          {/* Example Recent Activity Item 2 */}
          <View style={styles.activityItem}>
            <View style={styles.activityIconBg}>
              <Ionicons name="bag-handle-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>New order received</Text>
              <Text style={styles.activityInfo}>Order #:SPK93284</Text>
              <Text style={styles.activityInfo}>Total Amount: <Text style={styles.activityAmount}>$109.13</Text></Text>
              <Text style={styles.activityInfo}>Size: 1</Text>
            </View>
            <Text style={styles.activityTime}>9h ago</Text>
          </View>

          {/* Example Recent Activity Item 3 */}
          <View style={styles.activityItem}>
            <View style={styles.activityIconBg}>
              <Ionicons name="bag-handle-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>New order received</Text>
              <Text style={styles.activityInfo}>Order #:SW M93284</Text>
              <Text style={styles.activityInfo}>Total Amount: <Text style={styles.activityAmount}>$274.13</Text></Text>
              <Text style={styles.activityInfo}>Size: 2</Text>
            </View>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light background for the screen
  },
  header: {
    backgroundColor: '#FFEB3B', // Amber color for header background
    padding: 20,
    paddingTop: 50, // More padding to push content down from notch
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    // Add shadow if desired
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dashboardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#555',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFF', // White background for cards
    borderRadius: 10,
    padding: 15,
    width: '48%', // Roughly half width for two columns
    marginBottom: 15,
    // Add shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statCardTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  statCardValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '30%', // Three items per row
    marginBottom: 20,
  },
  quickActionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30, // Half of width/height for a circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // Add subtle shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  leaveSellerModeButton: {
    backgroundColor: '#EF4444', // Red color for the button
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    // Add shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leaveSellerModeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentActivityContainer: {
    backgroundColor: '#FFF', // White background for the activity container
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 30,
    // Add shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  activityIconBg: {
    backgroundColor: '#E8F5E9', // Light green background for the bag icon
    borderRadius: 20,
    padding: 8,
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  activityInfo: {
    fontSize: 13,
    color: '#666',
  },
  activityAmount: {
    fontWeight: 'bold',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default SellerDashboardScreen;