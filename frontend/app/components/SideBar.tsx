"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import React, { Dispatch, FC, SetStateAction, useState } from "react";

interface SideBarProps {
  filters: {
    search: string;
    sport: string;
  };
  setFilters: Dispatch<SetStateAction<SideBarProps["filters"]>>;
}

const sports = ["All", "Football", "Basketball", "Tennis", "Cricket", "Hockey"];

const SideBar: FC<SideBarProps> = ({ filters, setFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const resetFilters = () => {
    setFilters({ search: "", sport: "all" });
  };
  
  const hasActiveFilters = filters.search || filters.sport !== "all";
  
  return (
    <aside className={`bg-secondary border-r border-border transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"}`}>
      <div className="sticky top-0">
        {/* Header with collapse button */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/80">
          {!isCollapsed && <h2 className="text-lg font-semibold text-foreground">Filters</h2>}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-muted-foreground hover:text-primary hover:bg-secondary ${isCollapsed ? "mx-auto" : ""}`}
          >
            <Filter size={20} className={isCollapsed ? "" : "rotate-90"} />
          </Button>
        </div>
        
        {/* Filters content */}
        {!isCollapsed && (
          <div className="p-4 space-y-6">
            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search games..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-8 bg-background border-input"
                />
                {filters.search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7 hover:text-primary hover:bg-secondary"
                    onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Sport Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sport Type</label>
              <Select
                value={filters.sport}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, sport: value }))}
              >
                <SelectTrigger className="w-full bg-background border-input">
                  <SelectValue placeholder="Select Sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport.toLowerCase()}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Active Filters</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters} 
                    className="text-xs h-7 text-primary hover:bg-secondary/80"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge 
                      variant="outline" 
                      className="flex gap-1 items-center bg-accent/10 text-accent-foreground border-accent/20"
                    >
                      Search: {filters.search}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-primary" 
                        onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                      />
                    </Badge>
                  )}
                  {filters.sport !== "all" && filters.sport && (
                    <Badge 
                      variant="outline" 
                      className="flex gap-1 items-center bg-primary/10 text-primary-foreground border-primary/20"
                    >
                      Sport: {filters.sport}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-accent" 
                        onClick={() => setFilters((prev) => ({ ...prev, sport: "all" }))}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;