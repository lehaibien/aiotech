import { SvgIconComponent } from "@mui/icons-material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  icon?: SvgIconComponent;
}

export default function StatCard({
  title,
  value,
  percentageChange,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontWeight="700" color="text.secondary">
            {title}
          </Typography>
          {Icon && (
            <Box
              sx={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon color="primary" />
            </Box>
          )}
        </Box>
        <Typography fontSize="1.8rem" mb={1}>
          {value}
        </Typography>
        {percentageChange && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              color={percentageChange > 0 ? "success" : "error"}
              bgcolor={percentageChange > 0 ? "success" : "error"}
            >
              {Math.abs(percentageChange)}%{" "}
              {percentageChange > 0 ? (
                <TrendingUpIcon fontSize="small" />
              ) : (
                <TrendingDownIcon fontSize="small" />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              so với tháng trước
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
