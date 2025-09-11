import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Users, 
  Star,
  TrendingUp 
} from "lucide-react";

export function SummaryCards() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Summary Cards</h2>
        <Badge variant="outline">Consectetur adipiscing</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Lorem Ipsum */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lorem Ipsum</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Dolor sit amet</span>
                <span className="font-medium">Consectetur</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Adipiscing elit</span>
                <span className="font-medium">Sed do</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Eiusmod tempor</span>
                <span className="font-medium">Incididunt</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ut Labore */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ut Labore</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Et dolore magna</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Aliqua ut enim</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Ad minim veniam</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quis Nostrud */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quis Nostrud</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Exercitation</span>
                <Badge variant="destructive" className="text-xs">Ullamco</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Laboris nisi</span>
                <Badge variant="secondary" className="text-xs">Ut aliquip</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ex ea commodo</span>
                <Badge variant="outline" className="text-xs">Consequat</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duis Aute */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duis Aute</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Irure dolor</span>
                <span className="text-red-500">In reprehenderit</span>
              </div>
              <div className="flex items-center justify-between">
                <span>In voluptate</span>
                <span className="text-yellow-500">Velit esse</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cillum dolore</span>
                <span className="text-green-500">Eu fugiat</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nulla Pariatur */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nulla Pariatur</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Excepteur sint</span>
                <span className="font-medium">Occaecat</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Cupidatat non</span>
                <span className="font-medium">Proident</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Sunt in culpa</span>
                <span className="font-medium">Qui officia</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deserunt Mollit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deserunt Mollit</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Anim id est</span>
                <span className="font-medium">Laborum</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Sed ut perspiciatis</span>
                <span className="font-medium text-green-600">Unde omnis</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Iste natus</span>
                <span className="font-medium">Error sit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voluptatem */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voluptatem</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">Accusantium</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Doloremque laudantium</p>
            </div>
          </CardContent>
        </Card>

        {/* Totam Rem */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totam Rem</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Aperiam eaque</span>
                <span className="font-medium text-green-600">Ipsa quae</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Ab illo inventore</span>
                <span className="font-medium">Veritatis</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Et quasi architecto</span>
                <span className="font-medium text-green-600">Beatae vitae</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}