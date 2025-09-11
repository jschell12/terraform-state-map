import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from "lucide-react";

export function HeroPanel() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="mb-2">Hero Panel</h1>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Consectetur adipiscing
          </Badge>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dolor Sit Amet</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Lorem Ipsum</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Consectetur adipiscing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sed Do Eiusmod</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tempor</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Incididunt ut labore
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Et Dolore Magna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aliqua</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              Ut enim ad minim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veniam Quis</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nostrud</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Exercitation ullamco
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Main Content Panel */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Lorem Ipsum Dolor Sit</CardTitle>
            <CardDescription>
              Amet consectetur adipiscing elit sed do eiusmod
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-muted-foreground">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="flex gap-2 pt-4">
                <Badge>Consectetur</Badge>
                <Badge variant="secondary">Adipiscing</Badge>
                <Badge variant="outline">Elit</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Sed Do Eiusmod</CardTitle>
            <CardDescription>
              Tempor incididunt ut labore
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4>Et Dolore Magna</h4>
                <p className="text-sm text-muted-foreground">
                  Aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </p>
              </div>
              <div className="space-y-2">
                <h4>Laboris Nisi</h4>
                <p className="text-sm text-muted-foreground">
                  Ut aliquip ex ea commodo consequat duis aute irure dolor.
                </p>
              </div>
              <div className="space-y-2">
                <h4>In Reprehenderit</h4>
                <p className="text-sm text-muted-foreground">
                  In voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Width Panel */}
        <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle>Excepteur Sint Occaecat</CardTitle>
            <CardDescription>
              Cupidatat non proident sunt in culpa qui officia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <h4>Nemo Enim</h4>
                  <p className="text-sm text-muted-foreground">Ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
                </div>
                <div className="space-y-2">
                  <h4>Sed Quia</h4>
                  <p className="text-sm text-muted-foreground">Consequuntur magni dolores eos qui ratione voluptatem sequi.</p>
                </div>
                <div className="space-y-2">
                  <h4>Neque Porro</h4>
                  <p className="text-sm text-muted-foreground">Quisquam est qui dolorem ipsum quia dolor sit amet.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}